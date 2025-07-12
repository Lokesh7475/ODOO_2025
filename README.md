# 🛍️ ODOO - Item Swap & Sale Platform

A full-stack web application for swapping and selling items between users. Built with MERN stack (MongoDB, Express.js, React.js, Node.js).

## 🌟 Features

### 🔄 Swap System
- **Item Swapping**: Users can swap items with each other
- **Swap Requests**: Send, accept, reject, and cancel swap requests
- **Real-time Updates**: Track swap request status
- **History Tracking**: Complete transaction history

### 💰 Sale System
- **Item Listings**: Create and manage item listings
- **Multiple Listing Types**: For sale, for swap, or both
- **Price Management**: Set prices for items
- **Category Filtering**: Organize items by categories

### 👤 User Management
- **Authentication**: JWT-based authentication
- **User Profiles**: Complete user profiles with avatars
- **Dashboard**: Personal dashboard with statistics
- **Transaction History**: Track all swaps and sales

### 🖼️ Media Management
- **Image Upload**: Cloudinary integration for image storage
- **Multiple Images**: Support for up to 10 images per item
- **Avatar Management**: User profile picture upload

## 🏗️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Multer** - File upload handling
- **Cloudinary** - Image storage
- **bcrypt** - Password hashing

### Frontend
- **React.js** - UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **React Icons** - Icon library

## 📁 Project Structure

```
ODOO_REPO_001/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── user.controller.js
│   │   │   ├── listing.controller.js
│   │   │   ├── swap.controller.js
│   │   │   └── dashboard.controller.js
│   │   ├── models/
│   │   │   ├── user.models.js
│   │   │   ├── item.models.js
│   │   │   ├── listing.models.js
│   │   │   ├── swaprequests.models.js
│   │   │   ├── buyrequest.models.js
│   │   │   └── history.models.js
│   │   ├── routes/
│   │   │   ├── user.routes.js
│   │   │   ├── listing.routes.js
│   │   │   └── swap.routes.js
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js
│   │   │   └── multer.middleware.js
│   │   ├── utils/
│   │   │   ├── ApiError.js
│   │   │   ├── ApiResponse.js
│   │   │   ├── asyncHandler.js
│   │   │   └── cloudinary.js
│   │   ├── db/
│   │   │   └── index.js
│   │   ├── app.js
│   │   └── index.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.js
│   │   └── index.js
│   ├── public/
│   └── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Lokesh7475/ODOO_2025.git
   cd ODOO_REPO_001
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Environment Setup**

   Create `.env` file in the backend directory:
   ```env
   PORT=8000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   REFRESH_TOKEN_SECRET=your_refresh_token_secret
   CORS_ORIGIN=http://localhost:3000
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

5. **Start the development servers**

   **Backend:**
   ```bash
   cd backend
   npm run dev
   ```

   **Frontend:**
   ```bash
   cd frontend
   npm start
   ```

## 📚 API Documentation

### Base URL
```
http://localhost:8000/api/v1
```

### Authentication
All protected routes require a Bearer token in the Authorization header:
```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

### User Routes
- `POST /users/register` - Register new user
- `POST /users/login` - User login
- `POST /users/logout` - User logout
- `POST /users/refreshToken` - Refresh access token
- `POST /users/changePassword` - Change password
- `POST /users/current-user` - Get current user
- `PATCH /users/update-account` - Update account details
- `PATCH /users/update-avatar` - Update avatar
- `GET /users/c/:username` - Get user profile

### Listing Routes
- `GET /listings` - Get all listings
- `GET /listings/search` - Search listings
- `GET /listings/:id` - Get single listing
- `POST /listings/create` - Create listing (with images)
- `POST /listings/create-json` - Create listing (JSON only)
- `GET /listings/user` - Get user's listings
- `PATCH /listings/:id` - Update listing
- `DELETE /listings/:id` - Delete listing
- `PATCH /listings/:id/status` - Toggle listing status

### Swap Routes
- `POST /swaps/create` - Create swap request
- `GET /swaps/user` - Get user's swap requests
- `GET /swaps/:swapRequestId` - Get single swap request
- `PATCH /swaps/:swapRequestId/accept` - Accept swap request
- `PATCH /swaps/:swapRequestId/reject` - Reject swap request
- `PATCH /swaps/:swapRequestId/cancel` - Cancel swap request

## 🔧 Database Models

### User Model
- Username, email, password
- Full name, avatar
- Role and location
- Refresh token

### Item Model
- Title, description, category
- Type (Male/Female/Unisex)
- Size, condition, price
- Images array
- Owner reference

### Listing Model
- Item reference
- Listing type (for_sale/for_swap/both)
- Live status
- Timestamps

### Swap Request Model
- Items to be swapped
- Requester and responder
- Acceptance status
- Timestamps

### History Model
- User actions (swapped/bought/sold)
- Item references
- Other user reference
- Timestamps

## 🎯 Key Features

### Swap Workflow
1. User creates a swap request with their item and desired item
2. Request is sent to the item owner
3. Owner can accept, reject, or ignore the request
4. If accepted, ownership transfers automatically
5. History records are created for both users

### Listing Management
1. Users can create listings with multiple images
2. Set listing type (sale/swap/both)
3. Add categories, tags, and descriptions
4. Toggle listing visibility
5. Update or delete listings

### User Dashboard
1. View transaction statistics
2. Track swap and sale history
3. Manage active listings
4. Monitor pending requests

## 🛠️ Development

### Backend Development
```bash
cd backend
npm run dev
```

### Frontend Development
```bash
cd frontend
npm start
```

### Database
The application uses MongoDB with Mongoose ODM. Make sure MongoDB is running locally or use a cloud service like MongoDB Atlas.

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port | Yes |
| `MONGODB_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | JWT signing secret | Yes |
| `REFRESH_TOKEN_SECRET` | Refresh token secret | Yes |
| `CORS_ORIGIN` | Frontend URL | Yes |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | Yes |
| `CLOUDINARY_API_KEY` | Cloudinary API key | Yes |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | Yes |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👥 Team

- **Lokesh** - Backend Development
- **Joy Patel** - Frontend Development
- **Team Members** - Additional contributions

## 📞 Support

For support and questions, please contact the development team or create an issue in the repository.

---

**Happy Swapping! 🎉**
