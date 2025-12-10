# Quads Poker Backend

## Setup Instructions

### 1. Install PostgreSQL
Make sure PostgreSQL is installed on your system.

### 2. Create Database
```bash
psql -U postgres
CREATE DATABASE quads_poker;
\q
```

### 3. Run Schema
```bash
psql -U postgres -d quads_poker -f config/schema.sql
```

### 4. Environment Variables
Copy `.env.example` to `.env` and update with your values:
```bash
cp .env.example .env
```

Edit `.env` with your actual database credentials and API keys.

### 5. Install Dependencies
```bash
npm install
```

### 6. Run Development Server
```bash
npm run dev
```

The server will start on port 5000 (or your configured PORT).

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### User
- `GET /api/user/profile` - Get user profile (requires auth)
- `PUT /api/user/profile` - Update user profile (requires auth)

### Payment
- `POST /api/payment/create-checkout-session` - Create Stripe checkout session
- `POST /api/payment/webhook` - Stripe webhook handler

### Health
- `GET /api/health` - API health check
