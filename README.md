# Quads Poker

A comprehensive poker learning platform with three main modules: Learn, Train, and Play.

## Project Structure

```
quads-poker/
├── frontend/          # React + Vite + Tailwind CSS
├── backend/           # Node.js + Express + PostgreSQL
└── README.md
```

## Features

- User authentication (email/password)
- Premium subscription system with Stripe integration
- Three main modules:
  - **Learn**: Poker fundamentals and strategies (coming soon)
  - **Train**: Interactive exercises and practice (coming soon)
  - **Play**: Live poker games (coming soon)
- User profile and account management
- Earnings tracking

## Tech Stack

### Frontend
- React 18
- Vite
- Tailwind CSS
- React Router
- Fetch API for backend communication

### Backend
- Node.js
- Express
- PostgreSQL
- JWT authentication
- bcrypt for password hashing
- Stripe for payments

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up PostgreSQL database:
```bash
psql -U postgres
CREATE DATABASE quads_poker;
\q
```

4. Run the database schema:
```bash
psql -U postgres -d quads_poker -f config/schema.sql
```

5. Create environment file:
```bash
cp .env.example .env
```

6. Edit `.env` and add your configuration:
- Database connection string
- JWT secret
- Stripe API keys

7. Start the development server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### User
- `GET /api/user/profile` - Get user profile (requires auth)
- `PUT /api/user/profile` - Update user profile (requires auth)

### Payment
- `POST /api/payment/create-checkout-session` - Create Stripe checkout (requires auth)
- `GET /api/payment/subscription-status` - Get subscription status (requires auth)
- `POST /api/payment/webhook` - Stripe webhook handler

### Health
- `GET /api/health` - API health check

## Development Workflow

1. Make sure PostgreSQL is running
2. Start the backend server: `cd backend && npm run dev`
3. Start the frontend server: `cd frontend && npm run dev`
4. Access the app at `http://localhost:5173`

## Next Steps

The infrastructure is now set up! You can continue building:

1. **Poker logic and game engine** for the Play module
2. **Learning content** for the Learn module
3. **Training exercises** for the Train module
4. **Stripe products** in the Stripe dashboard and update the price IDs
5. **Game statistics** tracking and leaderboards

## Contributing

This is a personal project. Future updates will include the poker game logic and educational content.

## License

MIT
