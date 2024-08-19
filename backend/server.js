const express = require('express');
const authRoutes = require('./routes/auth.routes.js'); 
const dotenv = require('dotenv');
const connectMongoDB = require('./database/connectMongoDB.js');
const cookieParser = require('cookie-parser');


dotenv.config({ path: '../.env' });

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);

app.use(cookieParser());

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectMongoDB();
});