import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import './Home.css';
import googleDriveIcon from '../../assets/Google_Drive_icon.svg';
import dropboxIcon from '../../assets/dropbox.svg';
import oneDriveIcon from '../../assets/onedrive.svg';
import defaultCloudIcon from '../../assets/default_cloud.svg';
import DeleteIcon from '@mui/icons-material/Delete';

const Home = ({ apiBaseUrl }) => {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [storageData, setStorageData] = useState([]);
    const [contextMenu, setContextMenu] = useState(null);
    const [selectedAccount, setSelectedAccount] = useState(null);

    const navigate = useNavigate();

    const handleDriveClick = (accountId, accountType) => {
        navigate('/home/drive', {
            state: { accountId, accountType }
        });
    };

    const fetchAllDriveStorage = async () => {
        try {
            setLoading(true);
            setError(null);

            const token = localStorage.getItem('jwt_token');
            if (!token) throw new Error('No access token found');

            const response = await fetch(`${apiBaseUrl}/api/drive/all-storage/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'ngrok-skip-browser-warning': 'true'
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Failed to fetch storage data: ${errorData.error || 'Unknown error'}`);
            }

            const data = await response.json();
            return [
                ...data.google_drive.map(account => ({ ...account, type: 'google_drive' })),
                ...data.dropbox.map(account => ({ ...account, type: 'dropbox' })),
                ...data.onedrive.map(account => ({ ...account, type: 'onedrive' })),
            ];
        } catch (error) {
            setError('Unable to fetch storage data.');
            console.error('Error fetching storage data:', error);
            return [];
        } finally {
            setLoading(false);
        }
    };

    const formatBytes = (bytes) => {
        if (bytes === 0) return "0 Bytes";
        const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
    };

    useEffect(() => {

        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');

        if (token) {

            localStorage.setItem('jwt_token', token);

        }

        const handleFetchAllStorage = async () => {
            try {
                const accounts = await fetchAllDriveStorage();
                setStorageData(accounts);
                console.log("all accounts : ",accounts);
                console.log("api base url :",apiBaseUrl);
            } catch (err) {
                setError('Failed to fetch storage data');
            }
        };

        handleFetchAllStorage();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            // Close the context menu if clicking outside
            if (contextMenu) {
                handleCloseContextMenu();
            }
        };

        document.addEventListener("click", handleClickOutside);

        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, [contextMenu]);

    const handleContextMenu = (event, account) => {
        event.preventDefault();
        setContextMenu({
            mouseX: event.clientX - 2,
            mouseY: event.clientY - 4,
        });
        setSelectedAccount(account);
    };

    const handleCloseContextMenu = () => {
        setContextMenu(null);
        setSelectedAccount(null);
    };

    const handleDeleteAccount = async () => {
        if (!selectedAccount) return;

        try {
            const token = localStorage.getItem('jwt_token');
            if (!token) throw new Error('No access token found');
            console.log('account to delete :', selectedAccount);
            const response = await fetch(`${apiBaseUrl}/api/cloud/delete/${selectedAccount.account_id}/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'ngrok-skip-browser-warning': 'true'
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to delete account');
            }

            setStorageData(prevData =>
                prevData.filter(account => account.account_id !== selectedAccount.account_id)
            );
        } catch (error) {
            setError('Failed to delete the account');
            console.error('Error deleting account:', error);
        } finally {
            handleCloseContextMenu();
        }
    };

    return (
        <div className="flex-grow-1 d-flex flex-column" style={{ marginLeft: "250px", padding: "20px" }}>
            <h3>Added Accounts</h3>

            <div className="storage-container">
                {loading ? (
                    <p></p>
                ) : storageData && storageData.length > 0 ? (
                    storageData.map((account, index) => (
                        <div
                            key={index}
                            className="storage-item mb-3"
                            onClick={() => handleDriveClick(account.account_id, account.type)}
                            onContextMenu={(e) => handleContextMenu(e, account)}
                            style={{ cursor: 'pointer' }}
                        >
                            <div className="d-flex">
                                <img
                                    className="me-2"
                                    src={{
                                        google_drive: googleDriveIcon,
                                        dropbox: dropboxIcon,
                                        onedrive: oneDriveIcon,
                                    }[account.type] || defaultCloudIcon}
                                    alt={account.type}
                                    height={20}
                                    width={20}
                                />
                                <h5>{account.account_name}</h5>
                            </div>

                            <div className="progress" style={{ height: '12px', borderRadius: '10px' }}>
                                <div
                                    className="progress-bar bg-primary"
                                    role="progressbar"
                                    style={{ width: `${(account.used / account.total) * 100 || 0}%` }}
                                    aria-valuenow={(account.used / account.total) * 100}
                                    aria-valuemin="0"
                                    aria-valuemax="100"
                                >
                                    {((account.used / account.total) * 100).toFixed(2)}%
                                </div>
                            </div>
                            <p style={{ fontSize: 'small' }}>
                                Used: {formatBytes(account.used)} / Total: {formatBytes(account.total)}
                            </p>
                        </div>
                    ))
                ) : (
                    <p>No connected storage accounts found.</p>
                )}
            </div>

            <div className="overflow-auto  p-3" style={{ flexGrow: 1 }}>
                {error && <div className="alert alert-danger">{error}</div>}

                {loading && (
                    <div className="text-center mt-4">
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="mt-2">One moment please. . .</p>
                    </div>
                )}
            </div>

            {contextMenu && (
                <div
                    className="context-menu d-flex"
                    style={{
                        position: 'absolute',
                        top: contextMenu.mouseY,
                        left: contextMenu.mouseX,
                        backgroundColor: '#fff',
                        border: '1px solid black',
                        borderRadius: '5px',
                        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                        zIndex: 1000,
                    }}
                >
                    <div
                        onClick={handleDeleteAccount}
                        style={{
                            padding: '8px 16px',
                            cursor: 'pointer',

                        }}
                    >
                        <DeleteIcon /> Remove Account
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;
