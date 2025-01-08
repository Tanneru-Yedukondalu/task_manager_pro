import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../api'; 
import './Login.css'; 

const LoginForm = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSignup = () => {
        navigate("/signup");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { email, password } = formData;

        if (!email || !password) {
            setError("Email and password are required.");
            return;
        }

        try {
            const response = await loginUser(formData); 
        
            if (response.access_token) {
                localStorage.setItem('access_token', response.access_token);
            }

            setSuccess(true);
            setError(null);
            navigate('/home'); 
        } catch (err) {
            setError("Invalid email or password.");
            setSuccess(false);
        }
    };

    return (
        <div className="login-container">
            <div className="abcd">
            
            <h2 className="login-title">Login</h2>
            {error && <p className="login-error">{error}</p>}
            {success && <p className="login-success">Logged in successfully!</p>}
            <form className="login-form" onSubmit={handleSubmit}>
                <div className="login-field">
                    <label htmlFor="email" className="login-label">Email:</label>
                    <input
                        type="email"
                        name="email"
                        className="login-input"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="login-field">
                    <label htmlFor="password" className="login-label">Password:</label>
                    <input
                        type="password"
                        name="password"
                        className="login-input"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="login-actions">
                    <button type="submit" className="login-button">Login</button>
                    <button onClick={handleSignup} className="signup-redirect">Sign Up</button>
                </div>
            </form>
        </div>
        </div>
    );
};

export default LoginForm;
