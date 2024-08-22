const express = require('express');
const authRoutes = require('./routes/auth.routes.js'); 
const dotenv = require('dotenv');
const connectMongoDB = require('./database/connectMongoDB.js');
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/user.routes.js');

dotenv.config({ path: '../.env' });

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectMongoDB();
});