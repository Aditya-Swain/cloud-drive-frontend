import React from 'react';
import googleDriveIcon from '../../assets/Google_Drive_icon.svg';
import dropBoxIcon from '../../assets/dropbox.svg';
import oneDriveIcon from '../../assets/onedrive.svg';
import googleGIcon from '../../assets/google-g.svg';
import './AddCloud.css';



export default function AddCloud({ apiBaseUrl }) {


    const handleAddDrive = async () => {
        try {
            // Fetch the token from localStorage
            const token = localStorage.getItem('jwt_token');
            if (!token) {
                console.error('Authentication token missing');
                alert('Authentication token missing. Please log in first.');
                return;
            }



            // Pass the JWT token using the state parameter in the Google OAuth URL
            const state = encodeURIComponent(JSON.stringify({ jwt: token }));
            const scopes = [
                'https://www.googleapis.com/auth/drive',
                'https://www.googleapis.com/auth/userinfo.email',
                'https://www.googleapis.com/auth/photoslibrary.readonly',
                'https://www.googleapis.com/auth/photoslibrary.appendonly',
                'https://www.googleapis.com/auth/photoslibrary.edit.appcreateddata'
            ].join('%20'); // Join scopes with URL-encoded space

            const googleAuthUrl = `https://accounts.google.com/o/oauth2/auth?` +
                `client_id=971539199070-cdpj0fr7isomhu3cjra585rmh79masf0.apps.googleusercontent.com&` +
                `redirect_uri=${apiBaseUrl}/api/google/callback/cloud/&` +
                `response_type=code&` +
                `scope=${scopes}&` +
                `state=${state}&` +
                `prompt=consent&` +
                `access_type=offline`;





            // Redirect the user to Google's OAuth page
            window.location.href = googleAuthUrl;
        } catch (error) {
            // Log the error details for better debugging
            console.error('Error during adding cloud drive:', error);

            // Gracefully handle errors and notify the user
            alert('An error occurred while adding the cloud drive. Please try again later.');
        }
    };

    //Function to dropbox account

    const handleAddDropbox = async () => {
        try {
            const token = localStorage.getItem('jwt_token');
            if (!token) {
                console.error('Authentication token missing');
                alert('Authentication token missing. Please log in first.');
                return;
            }



            const state = encodeURIComponent(JSON.stringify({ jwt: token }));
            const dropboxAuthUrl = `https://www.dropbox.com/oauth2/authorize?` +
                `client_id=adjna7lg26jjpdc&` +
                `redirect_uri=${apiBaseUrl}/api/dropbox/callback/&` +
                `response_type=code&` +
                `state=${state}&` +
                `token_access_type=offline&` +
                `scope=account_info.read files.metadata.read files.content.read files.content.write files.metadata.write sharing.read sharing.write file_requests.read file_requests.write`;


            window.location.href = dropboxAuthUrl;
        } catch (error) {
            console.error('Error during adding Dropbox account:', error);
            alert('An error occurred while adding the Dropbox account. Please try again later.');
        }
    };

    const handleAddOneDrive = async () => {
        try {
            const token = localStorage.getItem('jwt_token');
            if (!token) {
                console.error('Authentication token missing');
                alert('Authentication token missing. Please log in first.');
                return;
            }

            const state = encodeURIComponent(JSON.stringify({ jwt: token }));
            const scopes = [
                'Files.Read',
                'Files.ReadWrite',
                'Files.Read.All',
                'Files.ReadWrite.All',
                'offline_access',
                'User.Read'
            ].join('%20'); // Join scopes with URL-encoded space

            const oneDriveAuthUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?` +
                `client_id=f17676bb-1568-484d-b9d5-8309f6e47a29&` +
                `redirect_uri=${apiBaseUrl}/api/onedrive/callback/&` +
                `response_type=code&` +
                `scope=${scopes}&` +
                `state=${state}&` +
                `access_type=offline`;

            window.location.href = oneDriveAuthUrl;
        } catch (error) {
            console.error('Error during adding OneDrive account:', error);
            alert('An error occurred while adding the OneDrive account. Please try again later.');
        }
    };



    // Array of cloud drive options
    const cloudDrives = [
        {
            id: 'google-drive',
            name: 'Google Drive',
            icon: googleDriveIcon,
            handling: handleAddDrive
        },
        {
            id: 'dropbox',
            name: 'Dropbox',
            icon: dropBoxIcon,
            handling: handleAddDropbox
        },
        {
            id: 'onedrive',
            name: 'OneDrive',
            icon: oneDriveIcon,
            handling: handleAddOneDrive
        }
    ];


    // Array of business cloud drive options
    const businessDrives = [
        {
            id: 'google-workspace',
            name: 'Google Workspace',
            icon: googleGIcon
        },
        {
            id: 'shared-drive',
            name: 'Shared Drive',
            icon: googleGIcon
        },
        {
            id: 'dropbox-business',
            name: 'Dropbox Business',
            icon: dropBoxIcon
        },
        {
            id: 'onedrive-business',
            name: 'OneDrive for Business',
            icon: oneDriveIcon
        }
    ];




    return (
        <div style={{ marginLeft: "250px", padding: '20px' }}>
            <h3>Add cloud to RocketDrive</h3>
            <span>Click on the cloud drive from below to connect it to RocketDrive</span>

            {/* Personal Cloud */}
            <div className='mt-4 business-header'>Personal Clouds</div>
            <div className="container mt-1 border-1 p-3 all-cloud d-flex">
                {cloudDrives.map((drive) => (
                    <div key={drive.id} className='clouds mx-3' onClick={() => drive.handling(drive.id)}>
                        <div className='single-cloud'>
                            <div>
                                <img
                                    src={drive.icon}
                                    alt={`${drive.name} icon`}
                                    height={50}
                                    width={50}
                                />
                            </div>
                            <div style={{ fontSize: 'smaller' }}>
                                {drive.name}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Business Cloud */}
            <div className='mt-4 business-header'>Business Clouds</div>
            <div className="container border-1 mt-1 p-3 all-cloud d-flex">
                {businessDrives.map((drive) => (
                    <div key={drive.id} className='clouds mx-3' onClick={() => handleAddDrive(drive.id)}>
                        <div className='single-cloud'>
                            <div>
                                <img
                                    src={drive.icon}
                                    alt={`${drive.name} icon`}
                                    height={50}
                                    width={50}
                                />
                            </div>
                            <div style={{ fontSize: 'smaller' }}>
                                {drive.name}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
