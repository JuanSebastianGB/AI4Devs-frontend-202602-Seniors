import React, { useState } from 'react';
import { uploadCvFile } from '../services/candidateApi';
import { Button, InputGroup, FormControl, Spinner } from 'react-bootstrap';

const FileUploader = ({ onUpload, onUploadError, onUploadAttemptStart, onFileSelected }) => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [fileData, setFileData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    const selected = event.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setFileName(selected.name);
    setFileData(null);
    onFileSelected?.();
  };

  const handleFileUpload = async () => {
    if (!file) return;
    onUploadAttemptStart?.();
    setLoading(true);
    try {
      const result = await uploadCvFile(file);
      setFileData(result);
      onUpload(result);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      onUploadError?.(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <InputGroup className="mb-3">
        <FormControl
          type="file"
          onChange={handleFileChange}
          aria-label="File"
          aria-describedby="basic-addon2"
        />
        <Button variant="outline-secondary" onClick={handleFileUpload}>
          {loading ? (
            <Spinner animation="border" role="status" size="sm" />
          ) : (
            'Subir Archivo'
          )}
        </Button>
      </InputGroup>
      <p className="mb-0">Selected file: {fileName}</p>
      {fileData && (
        <p className="mt-2">
          Archivo subido con éxito
        </p>
      )}
    </div>
  );
};

export default FileUploader;
