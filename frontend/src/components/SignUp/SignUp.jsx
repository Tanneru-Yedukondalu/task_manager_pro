import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signup } from '../../api';
import './SignUp.css';

const SignupForm = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: '',
        first_name: '',      
        last_name: '', 
        role: 'Manager',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { password, confirmPassword, username, email, first_name, last_name, role } = formData;

        console.log("Form Data: ", formData); // Add this line to debug

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (!username || !email || !password || !first_name || !last_name || !role) {
            setError("All fields are required.");
            return;
        }

        try {
            await signup(formData);
            setSuccess(true);
            setError(null);
            setFormData({ username: '', email: '', password: '', confirmPassword: '', firstName: '', lastName: '', role: 'Manager' });
            navigate("/");
        } catch (err) {
            setError("Error during signup.");
            setSuccess(false);
        }
    };

    const handleLogin = (e) => {
        e.preventDefault();
        navigate("/");
    };

    return (
        <div className="signup-container">
            <div className="abcdef">
            <h2 className="signup-title">Create Account</h2>
            {error && <p className="signup-error">{error}</p>}
            {success && <p className="signup-success">Account created successfully!</p>}
            <form className="signup-form" onSubmit={handleSubmit}>
                <div className="signup-field">
                    <label htmlFor="username" className="signup-label">Username:</label>
                    <input
                        type="text"
                        name="username"
                        className="signup-input"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="signup-field">
                        <label htmlFor="firstName" className="signup-label">First Name:</label>
                        <input
                            type="text"
                            name="first_name"
                            className="signup-input"
                            value={formData.first_name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="signup-field">
                        <label htmlFor="lastName" className="signup-label">Last Name:</label>
                        <input
                            type="text"
                            name="last_name"
                            className="signup-input"
                            value={formData.last_name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="signup-field">
                        <label htmlFor="role" className="signup-label">Role:</label>
                        <select
                            name="role"
                            className="signup-input"
                            value={formData.role}
                            onChange={handleChange}
                            required
                        >
                            <option value="Manager">Manager</option>
                            <option value="TeamLead">Team Lead</option>
                            <option value="Software Engineer">Software Engineer</option>
                            <option value="ML Engineer">ML Engineer</option>
                        </select>
                    </div>
                <div className="signup-field">
                    <label htmlFor="email" className="signup-label">Email:</label>
                    <input
                        type="email"
                        name="email"
                        className="signup-input"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="signup-field">
                    <label htmlFor="password" className="signup-label">Password:</label>
                    <input
                        type="password"
                        name="password"
                        className="signup-input"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="signup-field">
                    <label htmlFor="confirmPassword" className="signup-label">Confirm Password:</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        className="signup-input"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="signup-actions">
                    <button type="submit" className="signup-button">Sign Up</button>
                    <button onClick={handleLogin} className="login-redirect">Login</button>
                </div>
            </form>
        </div>
        </div>
    );
};

export default SignupForm;
