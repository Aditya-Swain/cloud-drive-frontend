import React from 'react';
import { useLocation, Routes, Route, useParams } from 'react-router-dom';
import { useState } from 'react';
import Sidebar from './Sidebar/Sidebar';
import Home from '../pages/Home/Home';
import SignIn from './SignIn';
import SignUp from './SignUp';
import Layout from "../pages/Layout/Layout";
import CloudSyncComponent from '../pages/CloudSync/CloudSyncComponent';
import AddCloud from '../pages/AddCloud/AddCloud';
import DriveDetails from '../pages/DriveDetails/DriveDetails';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MainContent = ({ menuItems }) => {
  const API_BASE_URL = import.meta.env.VITE_BACKEND_DJANGO_URL;
  const [clipboard, setClipboard] = useState({ action: null, fileIds: [],baseUrls: [], sourceAccountId: null, sourcePaths:[] });
  const location = useLocation();
  const isAuthPage = location.pathname === '/signin' || location.pathname === '/signup' || location.pathname === '/';

  const handleGoogleSignIn = async () => {
    try {
      window.location.href = `${API_BASE_URL}/api/google/login/`;
    } catch (error) {
      console.error('Error during Google Sign-In:', error);
    }
  };

  return (
    <div className="d-flex" style={{ width: '100%' }}>
      {!isAuthPage && <Sidebar menuItems={menuItems} />}
      <ToastContainer position='bottom-right' theme='dark' />
      <div style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Layout />} />
          <Route path="/home" element={<Home apiBaseUrl={API_BASE_URL}/>} />
          <Route path="/signin" element={<SignIn handleGoogleSignIn={handleGoogleSignIn} />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/sync_cloud" element={<CloudSyncComponent />} />
          <Route path="/add_cloud" element={<AddCloud apiBaseUrl={API_BASE_URL}/>} />
          <Route path="/home/drive" element={<DriveDetails clipboard={clipboard} setClipboard={setClipboard} apiBaseUrl={API_BASE_URL} />} />
        </Routes>
      </div>
    </div>
  );
};

export default MainContent;
