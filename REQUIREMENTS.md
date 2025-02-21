# Requirements

## API Endpoints

The following API endpoints are implemented:

- `/users`: Handles user registration, login, and retrieval of user information.
- `/products`: Manages product listings, including creation, retrieval, updates, and deletion.
- `/orders`: Facilitates order placement, tracking, and management.

## Data Shapes

The data exchanged with the API endpoints conforms to the following shapes:

**User:**

```json
{
  "id": "integer",
  "username": "string",
  "email": "string",
  "password": "string", // Only during creation
  "created_at": "timestamp"
}
```

**Product:**

```json
{
  "id": "integer",
  "name": "string",
  "description": "string",
  "price": "decimal",
  "category": "string",
  "created_at": "timestamp"
}
```

**Order:**

```json
{
  "id": "integer",
  "user_id": "integer",
  "product_id": "integer",
  "quantity": "integer",
  "order_date": "timestamp",
  "status": "string" // e.g., "pending", "shipped", "delivered"
}
```

## Tables in database

**User Table:**

```
   Column   |          Type          | Collation | Nullable |              Default
------------+------------------------+-----------+----------+-----------------------------------
 id         | integer                |           | not null | nextval('users_id_seq'::regclass)
 password   | character varying(255) |           | not null |
 first_name | character varying(255) |           | not null |
 last_name  | character varying(255) |           | not null |
 email      | character varying(255) |           | not null |
Indexes:
    "users_pkey" PRIMARY KEY, btree (id)
    "users_email_key" UNIQUE CONSTRAINT, btree (email)
Referenced by:
    TABLE "orders" CONSTRAINT "orders_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
```

**Product Table:**

```
  Column  |          Type          | Collation | Nullable |               Default
----------+------------------------+-----------+----------+--------------------------------------
 id       | integer                |           | not null | nextval('products_id_seq'::regclass)
 name     | character varying(255) |           | not null |
 price    | numeric(10,2)          |           | not null |
 category | character varying(255) |           |          |
Indexes:
    "products_pkey" PRIMARY KEY, btree (id)
Referenced by:
    TABLE "order_products" CONSTRAINT "order_products_product_id_fkey" FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
```

**Order Table:**

```
   Column   |            Type             | Collation | Nullable |              Default
------------+-----------------------------+-----------+----------+------------------------------------
 id         | integer                     |           | not null | nextval('orders_id_seq'::regclass)
 user_id    | integer                     |           | not null |
 status     | character varying(20)       |           |          |
 created_at | timestamp without time zone |           |          | CURRENT_TIMESTAMP
Indexes:
    "orders_pkey" PRIMARY KEY, btree (id)
Check constraints:
    "orders_status_check" CHECK (status::text = ANY (ARRAY['active'::character varying, 'complete'::character varying]::text[]))
Foreign-key constraints:
    "orders_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
Referenced by:
    TABLE "order_products" CONSTRAINT "order_products_order_id_fkey" FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
```
