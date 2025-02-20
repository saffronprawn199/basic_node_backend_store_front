import client from '../database';
import { User } from '../types/userTypes';
import bcrypt from 'bcrypt';
import { Order } from '../types/orderTypes';


export class UserModel {
    async authenticate(email: string, password: string): Promise<User | null> {
        try {
            const sql_query = 'SELECT * FROM users WHERE email = $1';
            const result = await client.query(sql_query, [email]);
            const user = result.rows[0];

            if (user) {
                if (bcrypt.compareSync(password + process.env.BCRYPT_PASSWORD, user.password)) {
                    return user;
                }
            }
            return null;
        } catch (err) {
            throw new Error(`Could not authenticate user ${email}: ${err}`);
        }
    }

    async create(firstName: string, lastName: string, email: string, password: string): Promise<User> {
        try {

            const sql_query = 'INSERT INTO users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4) RETURNING *';
            console.log(firstName, lastName, email, password);
            // Hash password using bcrypt
            const hash = bcrypt.hashSync(
                password + process.env.BCRYPT_PASSWORD,
                parseInt(process.env.SALT_ROUNDS as string)
            );

            const result = await client.query(
                sql_query,
                [firstName, lastName, email, hash]
            );
            console.log(result.rows[0]);
            return result.rows[0];
        } catch (err) {
            throw new Error(`Could not create user: ${err}`);
        }
    }

    async show(id: number): Promise<User | null> {
        try {
            const result = await client.query('SELECT * FROM users WHERE id = $1', [id]);
            return result.rows[0];
        } catch (err) {
            throw new Error(`Could not find user ${id}: ${err}`);
        }
    }

    async index(): Promise<User[]> {
        try {
            const result = await client.query('SELECT * FROM users');
            return result.rows;
        } catch (err) {
            throw new Error(`Could not get users: ${err}`);
        }
    }

    async update(id: number, firstName: string, lastName: string, email: string, password: string): Promise<User | null> {
        try {
            const sql_query = 'UPDATE users SET first_name = $1, last_name = $2, email = $3, password = $4 WHERE id = $5 RETURNING *';
            
            //verify that user exist before update using bcrypt
            const user: User | null = await this.show(id);
            if (!user) {
                throw new Error(`User ${id} not found`);
            }

            // if the password exist we need to update password and username
            const hash_update = bcrypt.hashSync(
                password + process.env.BCRYPT_PASSWORD,
                parseInt(process.env.SALT_ROUNDS as string)
            );

            const result = await client.query(
                sql_query,
                [firstName, lastName, email, hash_update, id]
            );

            return result.rows[0];
        } catch (err) {
            throw new Error(`Could not update user ${id}: ${err}`);
        }
    }

    async delete(id: number): Promise<User | null> {
        try {
            const result = await client.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
            return result.rows[0];
        } catch (err) {
            throw new Error(`Could not delete user ${id}: ${err}`);
        }
    }

    async getRecentOrders(userId: number): Promise<Order[]> {
        try {
            const sql = `
                SELECT * FROM orders 
                WHERE user_id = $1 
                ORDER BY created_at DESC 
                LIMIT 5
            `;
            const result = await client.query(sql, [userId]);
            return result.rows;
        } catch (err) {
            throw new Error(`Could not get recent orders for user ${userId}: ${err}`);
        }
    }
}