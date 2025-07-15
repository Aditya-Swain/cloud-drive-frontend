import React from 'react';
import { NavLink } from 'react-router-dom';
import Profile from './Profile';
import { useLocation } from 'react-router-dom';

const Navbar = () => {
  let user = {
    name: 'kakashi',
    avatar: ''
  }

  const location = useLocation();
  const isAuth = location.pathname === '/' || location.pathname === '/signin' || location.pathname === '/signup';

  return (
    <nav className="navbar navbar-expand-lg navbar-dark fixed-top " style={{ backgroundColor: '#293166',height:'4rem' }}>
      <div className="container-fluid">
        {/* Brand */}
        <NavLink className="navbar-brand mx-3" to="/">
          RocketDrive
        </NavLink>

        {/* Toggle Button for Mobile */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar Links */}
        <div className="collapse navbar-collapse" id="navbarNav" >
          <ul className="navbar-nav ms-auto mx-5" style={{ color: 'white' }}>
            {isAuth && <li className="nav-item">
              <NavLink
                to="/signin"
                className={({ isActive }) =>
                  `nav-link text-light ${isActive ? 'active' : ''}`
                }
              >
                Sign In
              </NavLink>
            </li>}
           {isAuth && <li className="nav-item">
             <NavLink
                to="/signup"
                className={({ isActive }) =>
                  `nav-link text-light ${isActive ? 'active' : ''}`
                }
              >
                Sign Up
              </NavLink>
            </li>}

            {!isAuth && <li className='nav-item'><Profile user={user} /> </li>}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
