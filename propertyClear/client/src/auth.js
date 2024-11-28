import axios from "axios";

const API_URL = "http://localhost:5001"; // Your backend server URL

// Sign up function
const signup = async (email, password, name, roleNumber) => {
    try {
        const response = await axios.post(`${API_URL}/api/users/register`, {
            email,
            password,
            name,
            roleNumber,
        });
        return response.data;
    } catch (error) {
        console.error("Error during sign-up:", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Sign-up failed");
    }
};

// Sign in function
const signin = async (email, password) => {
    try {
        const response = await axios.post(`${API_URL}/api/users/login`, {
            email,
            password,
        });
        return response.data;
    } catch (error) {
        console.error("Error during sign-in:", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Sign-in failed");
    }
};

// Sign out function
const signout = async () => {
    try {
        const response = await axios.post(`${API_URL}/api/users/logout`);
        return response.data;
    } catch (error) {
        console.error("Error during sign-out:", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Sign-out failed");
    }
};

export { signup, signin, signout };
