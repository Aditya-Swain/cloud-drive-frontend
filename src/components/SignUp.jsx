import React from "react";
import { useNavigate, Link } from "react-router-dom";
import googleIcon from '../assets/google-g.svg';

const SignUp = () => {
    const navigate = useNavigate();

    // Redirect to backend for Google Sign-In
    const handleGoogleSignIn = () => {
        window.location.href = "http://127.0.0.1:8000/api/google/login/";
    };

    return (
        <div className="container d-flex flex-column align-items-center justify-content-center mt-3" style={{ height: '100vh' }}>
            <div className="card p-4 shadow-sm" style={{ maxWidth: "360px", width: "100%" }}>
                <h2 className="mb-4 text-center">Sign Up</h2>

                <form className="mb-4">
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            name="email"
                            placeholder="Enter your email"
                            required
                        />
                        <div id="email-error" className="text-danger small" style={{ display: "none" }}>
                            Please enter a valid email address.
                        </div>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            name="password"
                            placeholder="Enter your password"
                            required
                        />
                        <div id="password-error" className="text-danger small" style={{ display: "none" }}>
                            Please enter a password.
                        </div>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="password1" className="form-label">Confirm Password</label>
                        <input
                            type="password"
                            className="form-control"
                            id="password1"
                            name="password1"
                            placeholder="Confirm your password"
                            required
                        />
                        <div id="password1-error" className="text-danger small" style={{ display: "none" }}>
                            Passwords must match.
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary w-100">Sign Up</button>
                </form>

                <p className="text-center">
                    Already have an account? <Link to="/signin" style={{ textDecoration: 'none' }}>Sign In</Link>
                </p>

                <hr className="my-4" />

                <button className="btn btn-light w-100 border">
                    <img src={googleIcon} alt="" height={30} width={30} />  Continue with Google
                </button>
            </div>
        </div>
    );
};

export default SignUp;
