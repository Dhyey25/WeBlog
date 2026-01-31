# WeBlog

A modern, full-stack blog application built with React, TypeScript, Node.js, and Express. Features AI-powered content generation, rich text editing, user authentication, and a responsive design.

## 🌐 Live Demo

🚀 **[View Live Demo](https://weblog-3v8k.onrender.com/)**

## 🚀 Features

- **User Authentication**: Secure login/signup with JWT tokens
- **Rich Text Editor**: Powered by Editor.js for creating engaging blog posts
- **AI Content Generation**: Integrate with HuggingFace for AI-assisted writing
- **Image Management**: Cloudinary integration for image uploads and optimization
- **Search & Categories**: Advanced search functionality and blog categorization
- **Responsive Design**: Mobile-first design with Tailwind CSS and Material-UI
- **Real-time Features**: Live search and dynamic content loading
- **User Profiles**: Public profiles with user blogs and statistics
- **Comments System**: Interactive commenting on blog posts
- **Admin Dashboard**: User management and blog analytics

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer with Cloudinary
- **AI Integration**: HuggingFace Inference API
- **Email**: Nodemailer
- **Security**: Helmet, CORS, Rate Limiting

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Language**: TypeScript
- **State Management**: Redux Toolkit
- **UI Library**: Material-UI (MUI)
- **Styling**: Tailwind CSS
- **Rich Text Editor**: Editor.js
- **HTTP Client**: Axios
- **Routing**: React Router DOM

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- Node.js (v16 or higher)
- npm or pnpm
- MongoDB (local or cloud instance)
- Git

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Dhyey25/WeBlog.git
   cd WeBlog
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install

   # Install client dependencies
   cd client
   npm install
   cd ..
   ```

3. **Environment Setup**
   ```bash
   # Copy environment file
   cp .env.example .env

   # Edit .env with your configuration
   # Required variables:
   # - MONGO_URI: Your MongoDB connection string
   # - JWT_SECRET: Secret key for JWT tokens
   # - CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET: Cloudinary credentials
   # - HUGGINGFACE_API_KEY: For AI features
   # - EMAIL credentials for notifications
   ```

4. **Database Setup**
   ```bash
   # Seed the database with sample data (optional)
   npm run seeder
   ```

## 🏃‍♂️ Running the Application

### Development Mode
```bash
# Start the backend server
npm run dev

# In another terminal, start the frontend
cd client
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

### Production Build
```bash
# Build the frontend
cd client
npm run build
cd ..

# Build the backend
npm run build

# Start the production server
npm start
```

## 📁 Project Structure

```
WeBlog/
├── client/                 # React frontend
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── Pages/         # Page components
│   │   ├── context/       # React context providers
│   │   ├── features/      # Redux slices
│   │   └── api/           # API service functions
│   └── package.json
├── controllers/           # Express route controllers
├── models/               # MongoDB schemas
├── routes/               # API route definitions
├── middleware/           # Custom middleware
├── utils/                # Utility functions
├── DBSeeder/             # Database seeding scripts
├── errors/               # Custom error classes
└── server.ts             # Application entry point
```

## 🔧 Available Scripts

### Root Directory
- `npm run dev` - Start development server with nodemon
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Start production server
- `npm run format` - Format code with Prettier
- `npm run seeder` - Seed database with sample data

### Client Directory
- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## 🌐 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/logout` - User logout
- `POST /api/v1/auth/forgot-password` - Password reset request

### Blogs
- `GET /api/v1/blogs` - Get all blogs (public)
- `POST /api/v1/blogs` - Create new blog (authenticated)
- `GET /api/v1/blogs/:id` - Get single blog
- `PUT /api/v1/blogs/:id` - Update blog (author only)
- `DELETE /api/v1/blogs/:id` - Delete blog (author only)

### User Management
- `GET /api/v1/users/profile` - Get user profile
- `PUT /api/v1/users/profile` - Update user profile
- `GET /api/v1/users/:id/blogs` - Get user's blogs

### AI Features
- `POST /api/v1/ai/generate` - Generate content with AI

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Dhyey** - [GitHub](https://github.com/Dhyey25)

## 🙏 Acknowledgments

- [Editor.js](https://editorjs.io/) for the rich text editor
- [HuggingFace](https://huggingface.co/) for AI integration
- [Cloudinary](https://cloudinary.com/) for image management
- [Material-UI](https://mui.com/) for UI components
- [Tailwind CSS](https://tailwindcss.com/) for styling

---

⭐ If you found this project helpful, please give it a star!</content>
<parameter name="filePath">c:\Users\Admin\blog-app\README.md