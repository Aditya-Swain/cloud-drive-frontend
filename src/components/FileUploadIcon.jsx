import { Button } from "@mui/material";
import UploadIcon from "@mui/icons-material/Upload";

const FileUploadButton = ({ onChange }) => {
  return (
    <Button
      variant="contained"
      component="label"
      startIcon={<UploadIcon />}
    >
      Upload
      <input
        type="file"
        hidden
        multiple
        onChange={onChange}
      />
    </Button>
  );
};

export default FileUploadButton;
