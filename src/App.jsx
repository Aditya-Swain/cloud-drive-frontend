import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google'; // Import GoogleOAuthProvider

import Navbar from './components/Navbar';
import MainContent from './components/MainContent';
import GoogleDriveAuth from './components/GoogleDriveAuth';  // If needed for Google Drive authentication
import CloudSyncIcon from '@mui/icons-material/CloudSync';
import HomeSharpIcon from '@mui/icons-material/HomeSharp';
import EmailIcon from '@mui/icons-material/Email';
import WbCloudySharpIcon from '@mui/icons-material/WbCloudySharp';

const App = () => {
  const menuItems = [
    { name: 'Home', link: '/home', icon: <HomeSharpIcon /> },
    { name: 'Add Cloud', link: '/add_cloud', icon: <WbCloudySharpIcon /> },
    // { name: 'Add Email', link: '/add_email', icon: <EmailIcon /> },
    { name: 'Sync Cloud', link: '/sync_cloud', icon: <CloudSyncIcon /> },
  ];

  return (
    
    <GoogleOAuthProvider clientId="971539199070-cdpj0fr7isomhu3cjra585rmh79masf0.apps.googleusercontent.com">
      <Router>
       
        <Navbar />
        <div className="d-flex" style={{ marginTop: '56px' }}>
         
          <MainContent menuItems={menuItems} />
        </div>

      </Router>
    </GoogleOAuthProvider>
  );
};

export default App;
