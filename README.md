# StoreFront Backend API

## Overview

This project involves designing the database architecture for an online store, including tables and columns to meet data requirements, and developing a RESTful API to provide this data to frontend developers.

The project requirements are detailed in a separate requirements document.

## Getting Started

### PostgreSQL Database Setup

1. **Connect as the postgres user**:

   ```bash
   psql -U postgres
   ```

2. **Create the main database**:

   ```sql
   CREATE DATABASE storefront;
   ```

3. **Create a test database**:

   ```sql
   CREATE DATABASE storefront_test;
   ```

4. **Connect to the main database**:
   ```sql
   \c storefront
   ```

### Step 1: Clone the Repository

Clone this repository to your local machine.

### Step 2: Install Dependencies

Run the following command to install the necessary dependencies:

### Step 3: Configure Environment Variables

Create a `.env` file with the necessary parameters to connect to the PostgreSQL database. If the `ENV` variable is set to `test`, the application will use the `storefront_test` database. The `.env` file should look like this:

```
POSTGRES_HOST=localhost
POSTGRES_DB=storefront
POSTGRES_TEST_DB=storefront_test
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password
POSTGRES_PORT=5432
BCRYPT_PASSWORD=password
SALT_ROUND=10
TOKEN_SECRET=secret
ENV=dev
```

The database will be accessible on port 5432, and the server will be available at https://localhost:3000.

## API Endpoints

### Users

- **Get all users**: `GET /users` [Requires token]
- **Get user by ID**: `GET /users/:id` [Requires token]
- **Create a new user**: `POST /users` [Requires token]
- **Delete a user**: `DELETE /users/:id` [Requires token]

### Products

- **Get all products**: `GET /products`
- **Get product by ID**: `GET /products/:id`
- **Create a new product**: `POST /products` [Requires token]
- **Delete a product**: `DELETE /products/:id` [Requires token]

### Orders

- **Get current order by user ID**: `GET /orders/:id` [Requires token]

## Available Commands

- **Start the server**: `npm run start` or `yarn start`
- **Run tests**: `npm run test` or `yarn test`
- **Watch for changes**: `npm run watch` or `yarn watch`
