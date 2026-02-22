# Kacchi Likhavat - Writing & Journaling App

A full-stack MERN application for creative writing, note-taking, and storytelling.

## Features

- **Authentication**: Secure user registration and login with JWT
- **Notes**: Create, edit, and manage your notes
- **Stories**: Write and organize your creative stories
- **Journals**: Keep track of your daily thoughts
- **Free Writing**: Quick writing space for spontaneous ideas
- **Dashboard**: Overview of all your content with statistics

## Tech Stack

### Backend
- Node.js & Express
- MongoDB with Mongoose
- JWT Authentication
- TypeScript

### Frontend
- React with TypeScript
- Vite
- React Router
- Axios for API calls
- Lucide React for icons
- Custom CSS with modern design

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (running locally or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   cd /Users/veershah/Desktop/Ideas/Likhit
   ```

2. **Setup Backend**
   ```bash
   cd kacchi-likhavat-backend
   npm install
   ```

3. **Setup Frontend**
   ```bash
   cd ../kacchi-likhavat-frontend
   npm install
   ```

### Configuration

1. **Backend Environment Variables**
   
   The backend `.env` file is already configured at `/kacchi-likhavat-backend/.env`:
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/kacchi_likhavat
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-2026
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173
   ```

2. **Frontend Environment Variables**
   
   The frontend `.env` file is already configured at `/kacchi-likhavat-frontend/.env`:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

### Running the Application

1. **Start MongoDB**
   
   Make sure MongoDB is running on your system:
   ```bash
   # macOS (if installed via Homebrew)
   brew services start mongodb-community
   
   # Or start manually
   mongod --dbpath /path/to/your/data/directory
   ```

2. **Start Backend Server**
   ```bash
   cd kacchi-likhavat-backend
   npm run dev
   ```
   
   The backend will run on `http://localhost:5000`

3. **Start Frontend Development Server**
   ```bash
   cd kacchi-likhavat-frontend
   npm run dev
   ```
   
   The frontend will run on `http://localhost:5173`

4. **Access the Application**
   
   Open your browser and navigate to `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Rooms (Notes, Stories, Journals, Free Writing)
- `POST /api/rooms` - Create new room
- `GET /api/rooms` - Get all user's rooms
- `GET /api/rooms/:id` - Get specific room
- `PUT /api/rooms/:id` - Update room
- `DELETE /api/rooms/:id` - Delete room

## Project Structure

```
kacchi-likhavat-backend/
├── src/
│   ├── config/         # Database and environment config
│   ├── controllers/    # Route controllers
│   ├── middleware/     # Auth middleware
│   ├── models/         # Mongoose models
│   ├── routes/         # API routes
│   ├── types/          # TypeScript types
│   ├── utils/          # Utility functions
│   ├── app.ts          # Express app setup
│   └── server.ts       # Server entry point
└── .env                # Environment variables

kacchi-likhavat-frontend/
├── src/
│   ├── components/     # Reusable components
│   ├── context/        # React context (Auth)
│   ├── pages/          # Page components
│   ├── utils/          # API utilities
│   ├── App.tsx         # Main app component
│   ├── main.tsx        # Entry point
│   └── index.css       # Global styles
└── .env                # Environment variables
```

## Usage

1. **Sign Up**: Create a new account with your email and password
2. **Login**: Access your account
3. **Dashboard**: View your content statistics and recent activity
4. **Create Content**:
   - Click "New Note" to create a note
   - Click "New Story" to start a story
   - Use the navigation to access different sections
5. **Edit & Delete**: Click on any item to view, edit, or delete it

## Development

### Backend Development
```bash
cd kacchi-likhavat-backend
npm run dev  # Runs with ts-node-dev for hot reload
```

### Frontend Development
```bash
cd kacchi-likhavat-frontend
npm run dev  # Runs Vite dev server with hot reload
```

### Build for Production

**Backend:**
```bash
cd kacchi-likhavat-backend
npm run build  # Compiles TypeScript to JavaScript
npm start      # Runs compiled code
```

**Frontend:**
```bash
cd kacchi-likhavat-frontend
npm run build  # Creates optimized production build
npm run preview # Preview production build
```

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: `brew services list` (macOS)
- Check the MONGO_URI in `.env` matches your MongoDB setup
- For MongoDB Atlas, use the connection string provided by Atlas

### Port Already in Use
- Backend: Change `PORT` in backend `.env`
- Frontend: Vite will automatically try the next available port

### CORS Issues
- Ensure `FRONTEND_URL` in backend `.env` matches your frontend URL
- Check that both servers are running

## License

This project is private and for personal use.

## Author

Veer Shah
