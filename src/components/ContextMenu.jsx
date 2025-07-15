import React from 'react';
import {
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  ContentCopy,
  ContentCut,
  ContentPaste,
  Delete,
  Info
} from '@mui/icons-material';

const ContextMenu = ({
  anchorPosition,
  onClose,
  onMenuItemClick,
  clipboard ,
}) => {
  // Custom close handler to ensure proper focus management
  const handleClose = (event, reason) => {
    // Ensure menu closes on appropriate events
    if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
      onClose();
    }
  };

  return (
    <Menu
      open={!!anchorPosition}
      onClose={handleClose}
      anchorReference="anchorPosition"
      anchorPosition={anchorPosition}
      // Add these props to improve accessibility and focus management
      disableAutoFocusItem
      disableEnforceFocus
      slotProps={{
        backdrop: {
          // Ensure backdrop can be clicked to close
          onClick: onClose
        }
      }}
    >
      <MenuItem
        onClick={() => {
          onMenuItemClick('Copy');
          onClose();
        }}
      >
        <ListItemIcon>
          <ContentCopy fontSize="small" />
        </ListItemIcon>
        <ListItemText>Copy</ListItemText>
      </MenuItem>

      <MenuItem
        onClick={() => {
          onMenuItemClick('Cut');
          onClose();
        }}
      >
        <ListItemIcon>
          <ContentCut fontSize="small" />
        </ListItemIcon>
        <ListItemText>Cut</ListItemText>
      </MenuItem>
  
   { (clipboard.fileIds.length || clipboard.sourceAccountId) && <MenuItem
        onClick={() => {
          onMenuItemClick('Paste');
          onClose();
        }}
      >
        <ListItemIcon>
          <ContentPaste fontSize="small" />
        </ListItemIcon>
        <ListItemText>Paste</ListItemText>
      </MenuItem> }

      <MenuItem
        onClick={() => {
          onMenuItemClick('Delete');
          onClose();
        }}
      >
        <ListItemIcon>
          <Delete fontSize="small" />
        </ListItemIcon>
        <ListItemText>Delete</ListItemText>
      </MenuItem>

      <MenuItem
        onClick={() => {
          onMenuItemClick('Info');
          onClose();
        }}
      >
        <ListItemIcon>
          <Info fontSize="small" />
        </ListItemIcon>
        <ListItemText>Info</ListItemText>
      </MenuItem>
    </Menu>
  );
};

export default ContextMenu;