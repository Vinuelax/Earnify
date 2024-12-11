# Earnify

Earnify is a gamified rewards platform that turns your restaurant receipts into points. Compete on leaderboards, earn rewards, and redeem exclusive discounts at your favorite restaurants. Make dining out even more exciting!

---

## Features

- **Receipt Upload**: Snap a picture of your receipt or upload it to earn points.
- **Leaderboards**: Compete with other users and climb the ranks for each restaurant.
- **Rewards**: Redeem your points for discounts and special offers.
- **User-Friendly**: Modern and responsive UI for both web and mobile users.

---

## Tech Stack

### Frontend
- **Framework**: React with TypeScript
- **Styling**: Tailwind CSS
- **File Upload**: React Dropzone

### Backend
- **Framework**: Node.js with Express
- **Language**: TypeScript
- **Database**: PostgreSQL (managed by Prisma ORM)
- **Authentication**: JSON Web Tokens (JWT)
- **OCR Integration**: Google Cloud Vision API

### Deployment
- **Frontend**: Vercel
- **Backend**: Render / Heroku
- **Database**: Hosted PostgreSQL (e.g., Supabase or PlanetScale)

---

## Installation

### Prerequisites
- Node.js (v16+)
- PostgreSQL
- Yarn or npm

### Setup

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/earnify.git
   cd earnify
   ```

2. **Install Dependencies**:
   ```bash
   # For both frontend and backend
   cd frontend
   yarn install
   cd ../backend
   yarn install
   ```

3. **Configure Environment Variables**:
   Create `.env` files for both the frontend and backend with the following:

   #### Frontend (`frontend/.env`):
   ```env
   REACT_APP_API_URL=http://localhost:5000
   ```

   #### Backend (`backend/.env`):
   ```env
   DATABASE_URL=postgresql://<user>:<password>@localhost:5432/earnify
   JWT_SECRET=your_jwt_secret
   GOOGLE_CLOUD_API_KEY=your_google_cloud_api_key
   ```

4. **Setup Database**:
   Run Prisma migrations to set up your database schema:
   ```bash
   cd backend
   npx prisma migrate dev
   ```

5. **Start the Development Servers**:
   ```bash
   # Start the backend
   cd backend
   yarn dev

   # Start the frontend
   cd ../frontend
   yarn start
   ```

6. **Access the App**:
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend API: [http://localhost:5000](http://localhost:5000)

---

## Folder Structure

### Frontend
```
frontend/
├── src/
│   ├── components/          # Reusable React components
│   ├── pages/               # Main pages (e.g., Home, Profile, Leaderboard)
│   ├── styles/              # Tailwind CSS styles
│   ├── utils/               # Utility functions
│   └── App.tsx              # App entry point
├── public/                  # Static assets
├── package.json             # Frontend dependencies
```

### Backend
```
backend/
├── src/
│   ├── controllers/         # Business logic (auth, receipts, rewards)
│   ├── routes/              # API route handlers
│   ├── prisma/              # Database schema and migrations
│   ├── middleware/          # Authentication and validation middleware
│   ├── utils/               # Helper functions (e.g., OCR, JWT)
│   └── server.ts            # Server entry point
├── .env                     # Backend environment variables
├── package.json             # Backend dependencies
```

---

## API Endpoints

### Authentication
- `POST /api/auth/register`: Register a new user.
- `POST /api/auth/login`: Authenticate and return a JWT.

### Receipts
- `POST /api/receipts`: Upload a receipt to earn points.
- `GET /api/receipts`: Get the user's receipt history.

### Leaderboards
- `GET /api/leaderboard/:restaurantId`: Fetch the top 10 users for a specific restaurant.

### Rewards
- `GET /api/rewards`: List available rewards.
- `POST /api/rewards/redeem`: Redeem points for a reward.

---

## Contributing

Contributions are welcome! Follow these steps to contribute:

1. Fork the repository.
2. Create a new branch for your feature/fix:
   ```bash
   git checkout -b feature-name
   ```
3. Make your changes and commit them:
   ```bash
   git commit -m "Add new feature"
   ```
4. Push your branch and create a pull request.
   ```bash
   git push origin feature-name
   ```

---

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

---

## Contact

For any inquiries or feedback, reach out to:
- [Your Name](mailto:your-email@example.com)
- [GitHub Issues](https://github.com/your-username/earnify/issues)
