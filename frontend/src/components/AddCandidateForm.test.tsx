import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddCandidateForm from './AddCandidateForm';
import * as candidateApi from '../services/candidateApi';

jest.mock('../services/candidateApi', () => ({
  uploadCvFile: jest.fn(),
  createCandidate: jest.fn(),
}));

const mockedUpload = candidateApi.uploadCvFile as jest.MockedFunction<typeof candidateApi.uploadCvFile>;
const mockedCreate = candidateApi.createCandidate as jest.MockedFunction<typeof candidateApi.createCandidate>;

describe('AddCandidateForm', () => {
  beforeEach(() => {
    mockedUpload.mockReset();
    mockedCreate.mockReset();
  });

  function renderForm() {
    render(<AddCandidateForm />);
  }

  async function fillRequiredFields() {
    await userEvent.type(screen.getByLabelText(/^Nombre$/i), 'Ana');
    await userEvent.type(screen.getByLabelText(/^Apellido$/i), 'García');
    await userEvent.type(screen.getByLabelText(/^Correo Electrónico$/i), 'ana@example.com');
  }

  it('shows upload failure in the form alert instead of failing silently', async () => {
    renderForm();
    mockedUpload.mockRejectedValueOnce(new Error('Upload failed (400): tipo no válido'));

    const fileInput = screen.getByLabelText(/^File$/i);
    await userEvent.upload(fileInput, new File(['x'], 'cv.pdf', { type: 'application/pdf' }));
    await userEvent.click(screen.getByRole('button', { name: /subir archivo/i }));

    await waitFor(() => {
      const alert = screen.getByRole('alert');
      expect(alert).toHaveTextContent(/error al subir archivo/i);
      expect(alert).toHaveTextContent(/tipo no válido/i);
    });
  });

  it('clears upload error when the user selects a new file', async () => {
    renderForm();
    mockedUpload.mockRejectedValueOnce(new Error('Upload failed (400): bad'));

    const fileInput = screen.getByLabelText(/^File$/i);
    await userEvent.upload(fileInput, new File(['a'], 'one.pdf', { type: 'application/pdf' }));
    await userEvent.click(screen.getByRole('button', { name: /subir archivo/i }));

    await waitFor(() => expect(screen.getByRole('alert')).toBeInTheDocument());

    await userEvent.upload(fileInput, new File(['b'], 'two.pdf', { type: 'application/pdf' }));
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('clears a prior submit error after a successful CV upload', async () => {
    renderForm();
    await fillRequiredFields();

    mockedCreate.mockRejectedValueOnce(new Error('Datos inválidos: email duplicado'));
    await userEvent.click(screen.getByRole('button', { name: /^Enviar$/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/añadir candidato/i);
    });

    mockedUpload.mockResolvedValueOnce({
      filePath: '/uploads/1-cv.pdf',
      fileType: 'application/pdf',
    });

    const fileInput = screen.getByLabelText(/^File$/i);
    await userEvent.upload(fileInput, new File(['%PDF'], 'cv.pdf', { type: 'application/pdf' }));
    await userEvent.click(screen.getByRole('button', { name: /subir archivo/i }));

    await waitFor(() => {
      expect(screen.getByText(/archivo subido con éxito/i)).toBeInTheDocument();
    });
    expect(screen.queryByText(/error al añadir candidato/i)).not.toBeInTheDocument();
  });

  it('clears previous error at the start of a new submit attempt', async () => {
    renderForm();
    await fillRequiredFields();

    mockedCreate.mockRejectedValueOnce(new Error('Datos inválidos: fallo'));
    await userEvent.click(screen.getByRole('button', { name: /^Enviar$/i }));

    await waitFor(() => expect(screen.getByRole('alert')).toBeInTheDocument());

    mockedCreate.mockResolvedValueOnce(undefined);
    await userEvent.click(screen.getByRole('button', { name: /^Enviar$/i }));

    await waitFor(() => {
      expect(screen.getByText(/candidato añadido con éxito/i)).toBeInTheDocument();
    });
    expect(screen.queryByText(/error al añadir candidato/i)).not.toBeInTheDocument();
  });
});
