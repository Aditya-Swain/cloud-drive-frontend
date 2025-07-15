import React, { useState, useEffect, useRef } from "react";
import ContextMenu from "../../components/ContextMenu";
import { LinearProgress } from "@mui/material";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useParams, useLocation } from "react-router-dom";
import Button from '@mui/material/Button';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import CreateFolderModal from "../../components/CreateFolderModal";
import FileUploadIcon from "../../components/FileUploadIcon";
import UploadIcon from "@mui/icons-material/Upload";
import { UploadDropdown } from "../../components/UploadDropdown";
import { FileUploadHandler } from "../../components/FileUploadHandler";
import { toast } from 'react-toastify';
import noFileImg from '../../assets/no_file_img.png'



const DriveDetails = ({ clipboard, setClipboard,apiBaseUrl }) => {


    const location = useLocation();
    const { accountId, accountType } = location.state || {};

    const [files, setFiles] = useState([]);
    const [photos, setPhotos] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [currentView, setCurrentView] = useState("none");
    const [selectedItems, setSelectedItems] = useState([]);
    const [contextMenu, setContextMenu] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [currentPath, setCurrentPath] = useState(null);
    const [pathHistory, setPathHistory] = useState([]);
    const [destinationPath, setDestinationPath] = useState("/");
    const [isEmptySpaceContext, setIsEmptySpaceContext] = useState(false);
    const [open, setOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const uploadHandlerRef = useRef(null);







    // Fetch Drive Files
    const handleFetchDriveData = async (folderId = currentPath, filePath) => {
        setLoading(true);
        setError(null);
        setFiles([]);
        setSelectedItems([]);
        setCurrentView("drive");
        // toast.loading('Fetching folders and files...');
        console.log('destination path :', destinationPath);
        console.log('current path :', currentPath);
        console.log('path history :', pathHistory);

        try {
            const token = localStorage.getItem('jwt_token');
            if (!token) throw new Error('No access token found');

            const url = folderId
                ? `${apiBaseUrl}/api/drive/files/${accountId}/?folderId=${folderId}`
                : `${apiBaseUrl}/api/drive/files/${accountId}`;

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'ngrok-skip-browser-warning': 'true'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch drive files');
            }

            const { files } = await response.json();

            setFiles(files);
            console.log('fetched files :', files);


        } catch (error) {
            setError('An error occurred while fetching drive files.');
        } finally {
            setLoading(false);
        }
    };



    const handleCreateFolder = async (folderName) => {
        const token = localStorage.getItem('jwt_token');
        if (!token) {
            toast.error('No access token found');
            return;
        }

        const newFolderPath = accountType === 'google_drive'
            ? destinationPath
            : accountType === 'dropbox'
                ? destinationPath === '/'
                    ? `/${folderName}`
                    : destinationPath.endsWith(`/${folderName}`)
                        ? destinationPath
                        : `${destinationPath}/${folderName}`
                : 'My Folder';

        const url = `${apiBaseUrl}/api/drive/accounts/${accountId}/create-folder/`;

        try {
            toast.loading('Creating folder...');

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                    'ngrok-skip-browser-warning': 'true'
                },
                body: JSON.stringify({
                    folder_name: folderName,
                    new_folder_path: newFolderPath,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create folder');
            }

            const result = await response.json();
            console.log('Folder created:', result);

            toast.dismiss();
            toast.success('Folder created successfully 👌');
            handleFetchDriveData();
        } catch (error) {
            console.error('Error creating folder:', error);
            toast.dismiss();
            toast.error(`Error: ${error.message}`);
        }
    };


    // Handle Folder Click
    const handleFolderClick = (folder) => {
        const folderId = folder.id || folder.path_display;
        const folderPath = folder.path_display || folder.name || folderId;

        setPathHistory(prev => [...prev, folderId]);
        setCurrentPath(folderId);

        switch (accountType) {
            case 'dropbox': {
                setDestinationPath(folder.path_display);
                break;
            }
            case 'google_drive': {
                setDestinationPath(folder.id);
                break;
            }
            case 'onedrive': {
                setDestinationPath(folder.id);
                break;
            }
        }
        // setDestinationPath(folder.path_display);
        handleFetchDriveData(folderId, folderPath);
    };

    // Handle Back Navigation
    const handleBackNavigation = () => {
        if (pathHistory.length > 1) {
            const newPathHistory = [...pathHistory];
            newPathHistory.pop(); // Remove current folder
            const previousFolderId = newPathHistory[newPathHistory.length - 1];

            // Update path history
            setPathHistory(newPathHistory);

            // Update current path
            setCurrentPath(previousFolderId);

            // Update destination path by removing the last segment
            setDestinationPath(prev => {
                const segments = prev.split('/');
                segments.pop();
                return segments.join('/') || '/';
            });


            // Fetch data for previous folder
            handleFetchDriveData(previousFolderId);
        }
        else if (pathHistory.length === 1) {
            setPathHistory([]);
            setCurrentPath(null);
            handleFetchDriveData;
        }
    };






    // Fetch Google Photos
    const handleFetchPhotos = async () => {
        setLoading(true);
        setError(null);
        setCurrentView('photos');
        setPhotos([]);
        setSelectedItems([]);

        try {
            const token = localStorage.getItem('jwt_token');
            if (!token) throw new Error('No access token found');

            const response = await fetch(`${apiBaseUrl}/api/photos/${accountId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'ngrok-skip-browser-warning': 'true'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch Google Photos');
            }

            const { photos } = await response.json();
            console.log('Fetched Photos:', photos);
            setPhotos(photos);
        } catch (error) {
            console.error('Error fetching Google Photos:', error);
            setError('An error occurred while fetching Google Photos.');
        } finally {
            setLoading(false);
        }
    };

    // Toggle item selection
    const toggleItemSelection = (item) => {
        setSelectedItems((prev) => {
            const itemId = item.id;
            if (prev.find((i) => i.id === itemId)) {
                return prev.filter((i) => i.id !== itemId);
            }
            return [...prev, item];
        });
    };

    // Context Menu Handlers
    const handleContextMenu = (event, file = null) => {
        event.preventDefault();
        // setSelectedFile(file);
        if (file) {
            // Right-clicked on a file/folder
            setSelectedFile(file);
            setIsEmptySpaceContext(false); // Not an empty space
        } else {
            // Right-clicked on empty space
            setSelectedFile(null);
            setIsEmptySpaceContext(true); // Context is empty space
        }
        setContextMenu({
            mouseX: event.clientX - 2,
            mouseY: event.clientY - 4,
        });

    };


    const handleClose = () => {
        setContextMenu(null);
        setSelectedFile(null);
    };

    const handleMenuItemClick = async (action) => {
        const itemsToActOn = selectedItems.length > 0 ? selectedItems : selectedFile ? [selectedFile] : [];

        if (itemsToActOn.length === 0) {
            console.warn("No files selected for action!");
            handleClose();
            return;
        }

        const formattedItems = itemsToActOn.map(item => ({
            id: item.id,
            name: item.name || item.filename || 'Unknown Item',
            baseUrl: currentView === 'photos' ? item.baseUrl : '',
            sourcePath: currentView === 'drive' ? item.path_display || '' : '',
        }));

        switch (action) {
            case 'Copy':
                setClipboard({
                    action: 'copy',
                    fileIds: formattedItems.map(item => item.id),
                    baseUrls: currentView === 'photos' ? formattedItems.map(item => item.baseUrl) : [],
                    sourcePaths: formattedItems.map(item => item.sourcePath),
                    sourceAccountId: accountId,
                });
                console.log("Copied files:", formattedItems.map(item => item.name));
                console.log('Source Paths:', formattedItems.map(item => item.sourcePath));
                console.log('File Ids :', formattedItems.map(item => item.id));
                break;

            case 'Cut':
                setClipboard({
                    action: 'cut',
                    fileIds: formattedItems.map(item => item.id),
                    sourcePaths: formattedItems.map(item => item.sourcePath),
                    sourceAccountId: accountId,
                });
                console.log("Cut files:", formattedItems.map(item => item.name));
                console.log('Source Paths:', formattedItems.map(item => item.sourcePath));
                console.log("file ids :", formattedItems.map(item => item.id));
                break;

            case 'Delete':
                try {
                    setLoading(true);
                    const token = localStorage.getItem('jwt_token');
                    if (!token) throw new Error('No access token found');

                    // Use the correct URL for Dropbox operations
                    const url = accountType === 'dropbox'
                        ? `${apiBaseUrl}/api/dropbox/delete/`
                        : `${apiBaseUrl}/api/${currentView === 'drive' ? 'drive' : 'photos'}/delete-files/`;

                    // Prepare the request body based on account type
                    const requestBody = accountType === 'dropbox'
                        ? {
                            action: 'delete',
                            sourcePaths: formattedItems.map(item => item.sourcePath),
                            sourceAccountId: accountId,
                        }
                        : {
                            fileIds: formattedItems.map(item => item.id),
                            sourceAccountId: accountId,
                        };
                    console.log('sourcePath for delete : ', formattedItems.map(item => item.sourcePath));
                    const response = await fetch(url, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                            'ngrok-skip-browser-warning': 'true'
                        },
                        body: JSON.stringify(requestBody),
                    });

                    const data = await response.json();

                    if (!response.ok) {
                        throw new Error(data.error || 'Failed to delete files');
                    }

                    console.log('Files deleted successfully');
                    handleFetchDriveData();
                } catch (error) {
                    console.error('Delete error:', error);
                    setError(error.message || 'An error occurred while deleting files.');
                } finally {
                    setLoading(false);
                }
                break;

            case 'Paste':
                if (!clipboard.fileIds.length || !clipboard.sourceAccountId) {
                    console.warn("Clipboard is empty or invalid for paste!");
                    return;
                }

                try {
                    setLoading(true);
                    const token = localStorage.getItem('jwt_token');
                    if (!token) throw new Error('No access token found');

                    const url = clipboard.action === 'copy'
                        ? `${apiBaseUrl}/api/${currentView === 'drive' ? 'drive' : 'photos'}/transfer/<str:action>/`
                        : clipboard.action === 'cut'
                            ? `${apiBaseUrl}/api/${currentView === 'drive' ? 'drive' : 'photos'}/cut-paste/<str:action>/`
                            : '';
                    console.log('source paths: ', clipboard.sourcePaths);
                    console.log('sourceaccountid', clipboard.sourceAccountId)
                    const response = await fetch(url, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                            'ngrok-skip-browser-warning': 'true'
                        },
                        body: JSON.stringify({
                            action: clipboard.action,
                            fileIds: clipboard.fileIds,
                            baseUrls: clipboard.baseUrls || [],
                            sourcePaths: clipboard.sourcePaths || [],
                            sourceAccountId: clipboard.sourceAccountId,
                            destinationAccountId: accountId,
                            destinationPath: destinationPath || '/', // Use the new destinationPath state
                        }),
                    });
                    console.log('sourceaccountid', clipboard.sourceAccountId)
                    if (!response.ok) throw new Error('Failed to paste files');

                    console.log('Pasted successfully');
                    handleFetchDriveData();
                    setClipboard({ action: null, fileIds: [], sourcePaths: [], sourceAccountId: null });
                } catch (error) {
                    console.error('Paste error:', error);
                    setError('An error occurred while pasting files.');
                } finally {
                    setLoading(false);
                }
                break;


            default:
                console.log(`Unhandled action: ${action}`);
        }

        handleClose();
    };


    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleFileUploadClick = () => {
        handleMenuClose();
        // Use the exposed method from FileUploadHandler
        if (uploadHandlerRef.current) {
            uploadHandlerRef.current.triggerFileInput();
        }
    };

    const handleFolderUploadClick = () => {
        handleMenuClose();
        // Use the exposed method from FileUploadHandler
        if (uploadHandlerRef.current) {
            uploadHandlerRef.current.triggerFolderInput();
        }
    };



    const handleFileUpload = async (files) => {
        const token = localStorage.getItem('jwt_token');
        if (!token) {
            toast.error('No access token found');
            return;
        }

        try {
            toast.loading('Uploading files...');

            const formData = new FormData();
            files.forEach((file) => {
                formData.append('files', file);
            });
            formData.append('destination_path', destinationPath);
            formData.append('drive_type',accountType);
            console.log('account type inside formdata :',formData.get('drive_type'))
            console.log('account type outside formdata :',accountType)

            const response = await fetch(`${apiBaseUrl}/api/file-upload/${accountId}/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'ngrok-skip-browser-warning': 'true'
                },
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to upload files');
            }

            const result = await response.json();
            console.log('Files uploaded:', result);

            toast.dismiss();
            toast.success('Files uploaded successfully 👌');
            handleFetchDriveData(); 
        } catch (error) {
            console.error('Error uploading files:', error);
            toast.dismiss();
            toast.error(`Error: ${error.message}`);
        }
    };

    const handleFolderUpload = async (files) => {
        const token = localStorage.getItem('jwt_token');
        if (!token) {
            toast.error('No access token found');
            return;
        }

        try {
            toast.loading('Uploading folder...');

            const folderName = files[0]?.webkitRelativePath?.split('/')[0] || 'Unnamed Folder';
            console.log('Uploaded folder name:', folderName);

            const formData = new FormData();
            files.forEach((file) => {
                formData.append('folderFiles', file, file.webkitRelativePath);
            });

            formData.append('folder_name', folderName);
            formData.append('destination_path', destinationPath);
            formData.append('drive_type',accountType);

            const response = await fetch(`${apiBaseUrl}/api/upload-folder/${accountId}/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'ngrok-skip-browser-warning': 'true'
                },
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to upload folder');
            }

            const result = await response.json();
            console.log('Folder uploaded:', result);

            toast.dismiss();
            toast.success('Folder uploaded successfully 👌');
            handleFetchDriveData(); // Assuming you want to refresh drive data after upload
        } catch (error) {
            console.error('Error uploading folder:', error);
            toast.dismiss();
            toast.error(`Error: ${error.message}`);
        }
    };

    const formatBytes = (bytes) => {
        if (bytes === 0) return "0 Bytes";
        const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
    };

    useEffect(() => {
        handleFetchDriveData();
    }, [currentPath]);

    return (
        <div className="flex-grow-1 d-flex flex-column" style={{ marginLeft: "250px", padding: "20px" }}>
            {/* Actions */}
            <div
                className="bg-light border-bottom mb-3"
                style={{
                    position: "fixed",
                    marginTop: '-12px',
                    left: "250px",
                    right: "0",
                    zIndex: "1000",

                }}
            >
                {/* <FileUploadIcon /> */}
                {/* Upload Button */}
                <Button
                    variant="contained"
                    startIcon={<UploadIcon />}
                    onClick={handleMenuOpen}
                >
                    Upload
                </Button>

                {/* Upload Dropdown */}
                <UploadDropdown
                    anchorEl={anchorEl}
                    onMenuClose={handleMenuClose}
                    onFileUploadClick={handleFileUploadClick}
                    onFolderUploadClick={handleFolderUploadClick}
                />

                {/* File Upload Handler */}
                <FileUploadHandler
                    ref={uploadHandlerRef}
                    onFileUpload={handleFileUpload}
                    onFolderUpload={handleFolderUpload}
                />
                <Button
                    className="m-2"
                    variant="outlined"
                    onClick={() => {
                        setCurrentPath(null);
                        setPathHistory([]); // Set currentPath to null
                        handleFetchDriveData();  // Call handleFetchDriveData function
                    }}
                >
                    Drive Files
                </Button>

                <Button variant="outlined" className={`me-2 ${accountType === 'google_drive' ? '' : 'd-none'}`} onClick={handleFetchPhotos}>
                    Google Photos
                </Button>
                <Button variant="outlined" startIcon={<CreateNewFolderIcon />} onClick={() => setOpen(true)}>Create Folder</Button>
                <CreateFolderModal open={open} handleClose={() => setOpen(false)} handleCreate={handleCreateFolder} />

                {currentPath && (

                    <button
                        className="btn btn-sm border ms-2"
                        onClick={() => {
                            // setCurrentPath(null);
                            handleBackNavigation();
                            //  handleFetchDriveData(currentPath); // Fetch the parent directory or root
                        }}
                    >
                        <ArrowBackIosIcon />
                    </button>

                )}
                {
                    loading && (
                        <div className="mt-2">
                            <LinearProgress />
                        </div>
                    )
                }

            </div>

            {/* Drive Files */}
            <div className="row" style={{ marginTop: '70px' }} >
                {
                    (files == [] && loading == false) &&
                    <div className="container"><img src={noFileImg} alt="" height={100} width={100} />Your Files and Folders Will be here </div>
                }


                {error && <div className="alert alert-danger ">{error}</div>}
                {currentView === "drive" &&
                    files.map((file) => (
                        <div key={file.id} className="col-lg-3 col-md-4 col-sm-6 mb-3" >
                            <div style={{ cursor: 'pointer' }}
                                className={`card shadow-sm position-relative 
        ${selectedItems.find((i) => i.id === file.id) ? "border-primary" : ""}
        ${selectedFile?.id === file.id ? "border-warning" : ""}`}
                                onContextMenu={(event) => handleContextMenu(event, file)}
                                onClick={(event) => {
                                    if (event.target.type !== 'checkbox') {
                                        if (file.mimeType === "application/vnd.google-apps.folder" || file.type === "folder") {
                                            handleFolderClick(file);
                                        } else {
                                            toggleItemSelection(file);
                                        }
                                    }
                                }}
                            >
                                <div className="card-header bg-light d-flex justify-content-between align-items-center">
                                    <div className="text-truncate">{file.name}</div>
                                    <div className="form-check">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            checked={!!selectedItems.find((i) => i.id === file.id)}
                                            onChange={() => toggleItemSelection(file)} // Ensure the checkbox toggles selection
                                        />
                                    </div>
                                </div>
                                <div className="card-body text-center">
                                    <div className="file-icon mb-2">
                                        {file.mimeType === "application/vnd.google-apps.folder" || file.type === "folder" ? (
                                            <i className="bi bi-folder-fill text-warning" style={{ fontSize: "2rem" }}></i>
                                        ) : (
                                            <i className="bi bi-file-earmark-text text-secondary" style={{ fontSize: "2rem" }}></i>
                                        )}
                                    </div>
                                    <h6 className="card-title text-truncate" style={{ maxWidth: "90%" }}>
                                        {file.name}
                                    </h6>
                                    <p className="card-text text-muted small">
                                        {file.mimeType === "application/vnd.google-apps.folder" || file.type === "folder"
                                            ? "Folder"
                                            : formatBytes(file.size)}
                                    </p>
                                </div>
                            </div>

                        </div>
                    ))
                }





                {currentView === "photos" &&
                    photos.map((photo) => (
                        <div key={photo.id} className="col-lg-3 col-md-4 col-sm-6 mb-3">
                            <div
                                className={`card shadow-sm position-relative 
                ${selectedItems.find((i) => i.id === photo.id) ? "border-primary" : ""}
                ${selectedFile?.id === photo.id ? "border-warning" : ""}`}
                                onContextMenu={(event) => handleContextMenu(event, photo)}
                            >
                                {/* Card Header */}
                                <div className="card-header bg-light d-flex justify-content-between align-items-center">
                                    <div className="text-truncate">{photo.filename}</div>
                                    <div className="form-check">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            checked={!!selectedItems.find((i) => i.id === photo.id)}
                                            onChange={() => toggleItemSelection(photo)}
                                        />
                                    </div>
                                </div>

                                {/* Thumbnail */}
                                <div className="card-img-top bg-light d-flex align-items-center justify-content-center" style={{ height: '200px', overflow: 'hidden' }}>
                                    {photo.baseUrl ? (
                                        <img
                                            src={photo.baseUrl}
                                            alt={photo.filename}
                                            className="img-fluid"
                                            style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'cover' }}
                                        />
                                    ) : (
                                        <div className="text-muted">No Preview Available</div>
                                    )}
                                </div>

                                {/* Card Body */}
                                <div className="card-body">
                                    <p className="text-muted mb-0">
                                        Date: {photo.mediaMetadata.creationTime
                                            ? photo.mediaMetadata.creationTime.split('T')[0]
                                            : 'Unknown'}
                                    </p>
                                </div>

                            </div>
                        </div>
                    ))}

            </div>

            {/* Context Menu */}
            <ContextMenu clipboard={clipboard} setClipboard={setClipboard}
                anchorPosition={
                    contextMenu
                        ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
                        : undefined
                }
                onClose={handleClose}
                selectedFile={selectedFile}
                onMenuItemClick={handleMenuItemClick}
                isEmptySpaceContext={isEmptySpaceContext}
            />
        </div>
    );
};

export default DriveDetails;
