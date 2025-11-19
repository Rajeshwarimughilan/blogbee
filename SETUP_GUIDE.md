# BlogBee - Full-Stack Blogging Platform Setup Guide

## 📋 Prerequisites

Before starting, make sure you have the following installed on your system:

1. **Node.js** (version 14 or higher): https://nodejs.org/
2. **MongoDB** (Community Edition): https://www.mongodb.com/try/download/community
3. **Git** (optional): https://git-scm.com/downloads

## 🗂️ Project Structure

```
blogbee/
├── frontend (React app)
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── PostItem.js
│   │   │   ├── PostItem.css
│   │   │   ├── PostList.js
│   │   │   ├── PostList.css
│   │   │   ├── PostForm.js
│   │   │   └── PostForm.css
│   │   ├── pages/
│   │   │   ├── HomePage.js
│   │   │   ├── HomePage.css
│   │   │   ├── CreatePostPage.js
│   │   │   └── CreatePostPage.css
│   │   ├── services/
│   │   │   └── postService.js
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.js
│   └── package.json
└── backend/ (Node.js + Express API)
    ├── controllers/
    │   └── postController.js
    ├── models/
    │   └── Post.js
    ├── routes/
    │   └── postRoutes.js
    ├── server.js
    ├── package.json
    └── .env
```

## 🚀 Installation & Setup

### Step 1: Install MongoDB

#### Windows:
1. Download MongoDB Community Server from https://www.mongodb.com/try/download/community
2. Run the installer and follow the setup wizard
3. MongoDB will be installed as a Windows service and start automatically

#### macOS (using Homebrew):
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

#### Ubuntu/Linux:
```bash
# Import MongoDB public GPG key
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -

# Create list file for MongoDB
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Update package database
sudo apt-get update

# Install MongoDB
sudo apt-get install -y mongodb-org

# Start MongoDB service
sudo systemctl start mongod
sudo systemctl enable mongod
```

### Step 2: Verify MongoDB Installation

Open a new terminal/PowerShell window and run:
```bash
mongosh
```

If MongoDB is running correctly, you should see a MongoDB shell prompt.
Type `exit` to close the shell.

### Step 3: Setup Backend

Open PowerShell in your project directory and run:

```powershell
# Navigate to backend directory
cd backend

# Install backend dependencies
npm install

# Install additional development tool (optional)
npm install -g nodemon
```

### Step 4: Setup Frontend

Open a new PowerShell window in your project directory and run:

```powershell
# Install frontend dependencies (axios and react-router-dom)
npm install
```

## 🏃‍♂️ Running the Application

You'll need to run both the backend server and frontend development server simultaneously.

### Terminal 1: Start Backend Server

```powershell
# Navigate to backend directory
cd backend

# Start the backend server
npm run dev
# or alternatively: npm start
```

You should see:
```
🚀 Server running on port 5000
✅ Connected to MongoDB
```

### Terminal 2: Start Frontend Server

```powershell
# In the root directory (where package.json is)
npm start
```

The React development server will start and automatically open your browser to:
```
http://localhost:3000
```

## 🌐 API Endpoints

The backend server (http://localhost:5000) provides the following endpoints:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/posts` | Get all blog posts |
| GET | `/api/posts/:id` | Get a specific post by ID |
| POST | `/api/posts` | Create a new blog post |
| PUT | `/api/posts/:id` | Update an existing post |
| DELETE | `/api/posts/:id` | Delete a post |

## 📝 Usage Guide

### Creating a New Post:
1. Click "Write New Post" on the homepage
2. Fill in the title, author name, and content
3. Click "Create Post"
4. You'll be redirected to the homepage with your new post

### Editing a Post:
1. Click the "✏️ Edit" button on any post
2. Modify the fields in the form that appears
3. Click "Update Post"
4. The post will be updated immediately

### Deleting a Post:
1. Click the "🗑️ Delete" button on any post
2. Confirm the deletion in the dialog
3. The post will be removed immediately

## 🔧 Environment Configuration

### Backend Environment Variables (.env file in backend directory):
```
# MongoDB connection string
MONGODB_URI=mongodb://localhost:27017/blogbee

# Server port
PORT=5000

# Environment
NODE_ENV=development
```

### Frontend Environment Variables (optional .env file in root directory):
```
# Backend API URL (only needed if backend runs on different port)
REACT_APP_API_URL=http://localhost:5000/api
```

## 📦 Package Dependencies

### Backend Dependencies:
- **express**: Web framework for Node.js
- **mongoose**: MongoDB object modeling tool
- **cors**: Enable cross-origin resource sharing
- **dotenv**: Load environment variables from .env file
- **nodemon**: Development tool that restarts server on file changes

### Frontend Dependencies:
- **react**: JavaScript library for building user interfaces
- **react-dom**: DOM-specific methods for React
- **react-router-dom**: Routing library for React applications
- **axios**: Promise-based HTTP client for API requests

## 🐛 Troubleshooting

### Common Issues:

#### 1. Backend server won't start:
- Make sure MongoDB is running (`mongosh` should connect)
- Check if port 5000 is already in use
- Verify all backend dependencies are installed

#### 2. Frontend can't connect to backend:
- Ensure backend server is running on http://localhost:5000
- Check browser console for CORS errors
- Verify API_BASE_URL in postService.js

#### 3. MongoDB connection errors:
- Start MongoDB service: `brew services start mongodb-community` (macOS) or check Windows services
- Verify MongoDB is listening on port 27017
- Check MongoDB logs for errors

#### 4. Posts not loading:
- Open browser developer tools (F12)
- Check the Network tab for failed API calls
- Look for error messages in the Console tab

#### 5. npm install errors:
- Clear npm cache: `npm cache clean --force`
- Delete node_modules and package-lock.json, then run `npm install` again
- Make sure you have the latest version of Node.js

### Useful Commands:

```powershell
# Check if MongoDB is running
mongosh --eval "db.adminCommand('ismaster')"

# View MongoDB logs (macOS)
brew services list | grep mongodb

# Kill process on port 5000 (if stuck)
# Windows:
netstat -ano | findstr :5000
taskkill /PID <process_id> /F

# macOS/Linux:
lsof -ti:5000 | xargs kill -9

# Reset MongoDB data (if needed)
mongosh --eval "use blogbee; db.dropDatabase()"
```

## 🎉 Success!

Once both servers are running:
1. Frontend: http://localhost:3000
2. Backend API: http://localhost:5000

You should see the BlogBee homepage with the ability to create, read, edit, and delete blog posts!

## 🔄 Development Workflow

1. Make changes to your code
2. Backend changes require server restart (unless using nodemon)
3. Frontend changes auto-reload in the browser
4. Test your changes by interacting with the application
5. Check browser console and terminal for any errors

Happy blogging with BlogBee! 🐝✨