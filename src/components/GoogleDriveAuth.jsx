import React, { useState, useEffect } from 'react';
import { gapi } from 'gapi-script';

const GoogleDriveAuth = () => {
  const [authToken, setAuthToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [files, setFiles] = useState([]);
  const [connectedAccounts, setConnectedAccounts] = useState([]);

  // Initialize the Google API client
  useEffect(() => {
    gapi.load('client:auth2', initClient);
  }, []);

  const initClient = () => {
    gapi.client.init({
      apiKey: '',
      clientId: '',
      scope: 'https://www.googleapis.com/auth/drive.file',
      discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
    }).then(() => {
      const authInstance = gapi.auth2.getAuthInstance();
      authInstance.isSignedIn.listen(handleAuthChange);
    });
  };

  const handleAuthChange = (isSignedIn) => {
    if (isSignedIn) {
      const authInstance = gapi.auth2.getAuthInstance();
      const currentUser = authInstance.currentUser.get();
      const token = currentUser.getAuthResponse().access_token;
      setAuthToken(token);
      setUserInfo(currentUser.getBasicProfile());
      fetchFiles(token);
    }
  };

  const fetchFiles = (token) => {
    gapi.client.request({
      path: 'https://www.googleapis.com/drive/v3/files',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then(response => {
      setFiles(response.result.files);
    });
  };

  const handleLogin = () => {
    const authInstance = gapi.auth2.getAuthInstance();
    authInstance.signIn();
  };

  const handleLogout = () => {
    const authInstance = gapi.auth2.getAuthInstance();
    authInstance.signOut();
  };

  const handleConnectAnotherAccount = () => {
    const authInstance = gapi.auth2.getAuthInstance();
    authInstance.signIn().then(() => {
      const currentUser = authInstance.currentUser.get();
      const token = currentUser.getAuthResponse().access_token;
      setConnectedAccounts(prev => [...prev, { userInfo: currentUser.getBasicProfile(), token }]);
    });
  };

  const handleFileTransfer = (fileId, sourceToken, destinationToken) => {
    // Example of copying a file from one account to another
    gapi.client.request({
      path: `https://www.googleapis.com/drive/v3/files/${fileId}/copy`,
      method: 'POST',
      headers: {
        Authorization: `Bearer ${destinationToken}`,
      },
      body: JSON.stringify({
        parents: ['destination_folder_id'], // Optional, set the folder you want to copy to
      }),
    }).then(response => {
      console.log('File copied:', response);
    });
  };

  return (
    <div>
      <h1>Google Drive Integration</h1>
      {authToken ? (
        <div>
          <h2>Welcome {userInfo?.getName()}</h2>
          <button onClick={handleLogout}>Logout</button>
          <h3>Your Files</h3>
          <ul>
            {files.map((file) => (
              <li key={file.id}>
                {file.name} 
                <button onClick={() => handleFileTransfer(file.id, authToken, connectedAccounts[1]?.token)}>Transfer</button>
              </li>
            ))}
          </ul>
          <button onClick={handleConnectAnotherAccount}>Connect Another Account</button>
        </div>
      ) : (
        <button onClick={handleLogin}>Login with Google</button>
      )}
      <div>
        <h3>Connected Accounts:</h3>
        {connectedAccounts.map((account, index) => (
          <div key={index}>
            <p>{account.userInfo.getName()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GoogleDriveAuth;
