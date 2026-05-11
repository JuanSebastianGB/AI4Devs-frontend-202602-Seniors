import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FileUploader from './FileUploader';
import * as candidateApi from '../services/candidateApi';

jest.mock('../services/candidateApi', () => ({
  uploadCvFile: jest.fn(),
}));

const mockedUpload = candidateApi.uploadCvFile as jest.MockedFunction<typeof candidateApi.uploadCvFile>;

function pdfFile(name = 'cv.pdf') {
  return new File(['%PDF'], name, { type: 'application/pdf' });
}

type Callbacks = {
  onUpload?: jest.Mock;
  onUploadError?: jest.Mock;
  onUploadAttemptStart?: jest.Mock;
  onFileSelected?: jest.Mock;
};

function renderUploader(overrides: Callbacks = {}) {
  const props = {
    onUpload: overrides.onUpload ?? jest.fn(),
    onUploadError: overrides.onUploadError ?? jest.fn(),
    onUploadAttemptStart: overrides.onUploadAttemptStart ?? jest.fn(),
    onFileSelected: overrides.onFileSelected ?? jest.fn(),
  };
  render(<FileUploader {...props} />);
  return props;
}

describe('FileUploader', () => {
  beforeEach(() => {
    mockedUpload.mockReset();
  });

  it('notifies the parent when a new file is selected', async () => {
    const { onFileSelected } = renderUploader();

    await userEvent.upload(screen.getByLabelText(/^File$/i), pdfFile());

    expect(onFileSelected).toHaveBeenCalledTimes(1);
  });

  it('calls onUpload with the API result on successful upload', async () => {
    const result = { filePath: '/uploads/1-cv.pdf', fileType: 'application/pdf' };
    mockedUpload.mockResolvedValueOnce(result);
    const { onUpload, onUploadError } = renderUploader();

    await userEvent.upload(screen.getByLabelText(/^File$/i), pdfFile());
    await userEvent.click(screen.getByRole('button', { name: /subir archivo/i }));

    await waitFor(() => expect(onUpload).toHaveBeenCalledWith(result));
    expect(onUploadError).not.toHaveBeenCalled();
    expect(screen.getByText(/archivo subido con éxito/i)).toBeInTheDocument();
  });

  it('calls onUploadError with the error message when upload fails', async () => {
    mockedUpload.mockRejectedValueOnce(new Error('Upload failed (400): tipo no válido'));
    const { onUpload, onUploadError } = renderUploader();

    await userEvent.upload(screen.getByLabelText(/^File$/i), pdfFile());
    await userEvent.click(screen.getByRole('button', { name: /subir archivo/i }));

    await waitFor(() =>
      expect(onUploadError).toHaveBeenCalledWith(
        expect.stringMatching(/tipo no válido/i),
      ),
    );
    expect(onUpload).not.toHaveBeenCalled();
  });
});
