import googleIcon from '../assets/google-g.svg';


const SignIn = ({ handleGoogleSignIn }) => {


    return (
        <div className="container d-flex flex-column align-items-center justify-content-center mt-5">
            <div className="card p-4 shadow-sm" style={{ maxWidth: "360px", width: "100%" }}>
                <h2 className="mb-4 text-center">Login</h2>
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
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Login</button>
                </form>
                <p className="text-center">
                    Don't have an account? <a href='/signup'>Sign Up</a>
                </p>
                <hr className="my-4" />
                <button onClick={handleGoogleSignIn} className="btn btn-light w-100 border">
                    <img src={googleIcon} alt="" height={30} width={30} />  Sign in with Google
                </button>
            </div>
        </div>
    );
};

export default SignIn;
