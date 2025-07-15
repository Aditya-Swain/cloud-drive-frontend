import React from "react";
import { Link } from "react-router-dom";
import './Layout.css';
const Layout = () => {
    return (
      <section className=" app-gradient d-flex flex-column align-items-center justify-content-center text-center py-5 " style={{backgroundColor:'linearGradient(135deg, #6a11cb, #c0bdd2, #97939c)'}}>
        <h1 className="display-5 fw-bold mb-3">
          The easiest way to upload, <br/>share & manage your files 
        </h1>
        <p className="text-muted w-75 mx-auto mb-4">
          Make an account and start managing your files in less than a minute.
        </p>
        <div className="d-flex gap-3">
          <Link to="/signin"  className="btn btn-primary btn-lg">
            Get Started
          </Link>
          <Link to='/'  className="btn btn-outline-secondary btn-lg">
            Learn More
          </Link>
        </div>
      </section>
    );
  };
  
  export default Layout;
  