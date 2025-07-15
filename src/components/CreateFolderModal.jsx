import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function CreateFolderModal({ open, handleClose, handleCreate }) {
  const [folderName, setFolderName] = React.useState('');

  const handleSubmit = () => {
    if (folderName.trim()) {
      handleCreate(folderName);
      setFolderName('');
      handleClose();
    }
  };

  return (
    <Modal
      aria-labelledby="create-folder-modal-title"
      aria-describedby="create-folder-modal-description"
      open={open}
      onClose={handleClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{ backdrop: { timeout: 500 } }}
    >
      <Fade in={open}>
        <Box sx={style}>
          <Typography id="create-folder-modal-title" variant="h6" component="h2">
            Create New Folder
          </Typography>
          <TextField
            fullWidth
            label="Folder Name"
            variant="outlined"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            sx={{ mt: 2 }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            <Button onClick={handleClose} sx={{ mr: 1 }}>Cancel</Button>
            <Button variant="contained" onClick={handleSubmit} disabled={!folderName.trim()}>
              Create
            </Button>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
}
