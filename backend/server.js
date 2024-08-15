const express = require('express');
const authRoutes = require('./routes/auth.routes.js'); 
const dotenv = require('dotenv');

// Load environment variables from a custom path
dotenv.config({ path: '../.env' });

// Now access the environment variable
console.log(process.env.MONGO_URI); // This should correctly log the value of TEST from the .env file

const app = express();
app.use('/api/auth', authRoutes);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
