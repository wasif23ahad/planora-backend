# Planora Backend

Express + Prisma + PostgreSQL API for the Planora events platform.

## Setup

1.  **Install dependencies**:
    ```bash
    npm install
    ```

2.  **Environment Variables**:
    Copy `.env.example` to `.env` and fill in the values.
    ```bash
    cp .env.example .env
    ```

3.  **Database**:
    Initialize Prisma and run migrations.
    ```bash
    npx prisma generate
    npx prisma migrate dev
    ```

4.  **Seeding**:
    Seed the database with an admin user and sample events.
    ```bash
    npm run db:seed
    ```

5.  **Development**:
    ```bash
    npm run dev
    ```


