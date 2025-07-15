import React, { useState, useRef, forwardRef, useImperativeHandle } from 'react';

export const FileUploadHandler = forwardRef(({ 
  onFileUpload, 
  onFolderUpload 
}, ref) => {
  const fileInputRef = useRef(null);
  const folderInputRef = useRef(null);

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    triggerFileInput: () => {
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    },
    triggerFolderInput: () => {
      if (folderInputRef.current) {
        folderInputRef.current.click();
      }
    }
  }));

  const handleFileChange = (event) => {
    const files = event.target.files;
    if (files.length > 0) {
      onFileUpload(Array.from(files));
    }
  };

  const handleFolderChange = (event) => {
    const files = event.target.files;
    if (files.length > 0) {
      onFolderUpload(Array.from(files));
    }
  };

  return (
    <>
      {/* Hidden File Input for Files */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
        multiple
      />

      {/* Hidden File Input for Folders */}
      <input
        type="file"
        ref={folderInputRef}
        style={{ display: 'none' }}
        onChange={handleFolderChange}
        webkitdirectory="true"
        directory="true"
        multiple
      />
    </>
  );
});