const express = require('express');
const authRoutes = require('./routes/auth.routes.js'); 
const dotenv = require('dotenv');
const connectMongoDB = require('./database/connectMongoDB.js');
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/user.routes.js');
const cloudinary = require('cloudinary').v2;
const postRoutes = require('./routes/post.routes.js');
const notificationRoutes = require('./routes/notification.routes.js');

dotenv.config({ path: '../.env' });

cloudinary.config({
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
});

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/notifications', notificationRoutes); // Ensure the route is correctly defined

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectMongoDB();
});
