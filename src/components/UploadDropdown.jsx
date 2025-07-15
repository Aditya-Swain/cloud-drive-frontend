
import {
    Menu,
    MenuItem
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';


export const UploadDropdown = ({ 
    anchorEl, 
    onMenuClose, 
    onFileUploadClick, 
    onFolderUploadClick 
  }) => {
    return (
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={onMenuClose}
      >
        <MenuItem onClick={onFileUploadClick}>
          <UploadFileIcon sx={{ mr: 1 }} /> File Upload
        </MenuItem>
        <MenuItem onClick={onFolderUploadClick}>
          <DriveFolderUploadIcon sx={{ mr: 1 }} /> Folder Upload
        </MenuItem>
      </Menu>
    );
  };
  