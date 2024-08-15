const signup = async (req, res) => {
    try{
        const {fullName, username, email, password} = req.body;
        
    }   catch (error) {
        return res.status(400).json({message: error.message});
    }
};

const login = async (req, res) => {
    res.send('Login route');
};

const logout = async (req, res) => {
    res.send('Logout route');
};

module.exports = { signup, login, logout };
