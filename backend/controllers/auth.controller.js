const signup = async (req, res) => {
    res.send('Signup route');
};

const login = async (req, res) => {
    res.send('Login route');
};

const logout = async (req, res) => {
    res.send('Logout route');
};

module.exports = { signup, login, logout };
