import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ menuItems }) => {
  return (
    <div className="d-flex flex-column p-3 bg-light sidebar">
      <button
        className="btn btn-primary d-lg-none mb-3"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#sidebarMenu"
        aria-expanded="false"
        aria-controls="sidebarMenu"
      >
        Toggle Menu
      </button>
      <div className="collapse d-lg-block" id="sidebarMenu">
        <ul className="nav nav-pills flex-column mb-auto">
          {menuItems.map((item, index) => (
            <li className="nav-item" key={index}>
              <NavLink
                to={item.link}
                className={({ isActive }) =>
                  `nav-link d-flex align-items-center ${isActive ? 'active' : ''}`
                }
              >
                {item.icon && <span className="me-2">{item.icon}</span>}
                <span>{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
