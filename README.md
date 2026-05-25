# secure-auth-api

MyAuth is a Node.js + Express authentication API with MongoDB, JWT-based auth, email verification, password reset (link and OTP), and role-based route protection.

## Tech Stack

- Node.js (ES Modules)
- Express
- MongoDB + Mongoose
- JWT (`jsonwebtoken`)
- Zod validation
- bcrypt
- Nodemailer

## Features

- User registration
- Email verification with token link
- Login with access + refresh tokens
- Refresh access token
- Logout (clears cookies and stored refresh token)
- Protected profile route
- Role-based admin route
- Forgot Password with OTP
- Password Hashing with bcrypt
- Password reset via email link
- Password reset via OTP
- Basic rate limiting for incoming requests

## Learning

What I learned:
- Middleware chaining in Express
- JWT authentication flow
- Secure password handling
- Email verification flow
- OTP-based systems for sensitive actions
- Forgot password using:
  - Email reset token flow
  - OTP verification flow

## Development Workflow

Each feature was implemented and tested independently in dedicated branches before being merged into the main branch.

## Engineering Practices

- Feature-based branching workflow
- Modular middleware architecture
- Environment-based configuration
- Reusable validation logic
- Secure authentication practices

## Project Structure

```text
src/
  controllers/
  db/
  middlewares/
  model/
  routes/
  utils/
  validators/

```

## Getting Started

### 1) Install dependencies

```bash
npm install
```

### 2) Configure environment variables

Create a `.env` file in the project root:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017
ACCESS_TOKEN_SECRET=your_access_secret
REFRESH_TOKEN_SECRET=your_refresh_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
```

> `MONGODB_URI` is used as `${MONGODB_URI}/MyAuth` in the code.

### 3) Run in development

```bash
npm run dev
```

The API is mounted under:

```text
/api/users
```

## API Endpoints

Base path: `/api/users`

- `POST /register` — Register a user
- `GET /verify-email/:token` — Verify email
- `POST /login` — Login
- `POST /refresh-Token` — Refresh access token
- `POST /profile` — Protected profile endpoint
- `POST /logout` — Logout
- `POST /admin/dashboard` — Admin-only endpoint
- `POST /forgot-password` — Send password reset link
- `POST /reset-password/:token` — Reset password with token
- `POST /forgot-password-Otp` — Send OTP for password reset
- `POST /reset-password-Otp` — Reset password with OTP

## Security Notes

- Passwords are hashed with `bcrypt`.
- JWT tokens are used for access/refresh flows.
- Cookies are `httpOnly`, `secure`, and `sameSite: "strict"` in current code.
- Rate limit is currently set to **5 requests per minute per IP**.

## Scripts

- `npm run dev` — Start with nodemon
- `npm test` — Placeholder script (currently exits with error)

## Status

This project is under active experimentation and can be extended with:

- Better production email handling
- Stronger token/cookie strategy per environment
- Proper automated tests
