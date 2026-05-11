import { getApiBaseUrl } from '../apiConfig';
import type { CreateCandidatePayload } from './candidateApi';
import { createCandidate, uploadCvFile } from './candidateApi';

const minimalPayload: CreateCandidatePayload = {
  firstName: 'Ada',
  lastName: 'Lovelace',
  email: 'ada@example.com',
  phone: '',
  address: '',
  educations: [],
  workExperiences: [],
  cv: null,
};

describe('uploadCvFile', () => {
  beforeEach(() => {
    jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ filePath: '/uploads/x.pdf', fileType: 'application/pdf' }),
    } as Response);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls fetch with POST and FormData containing the file field the backend expects', async () => {
    const file = new File(['%PDF'], 'cv.pdf', { type: 'application/pdf' });
    await uploadCvFile(file);

    expect(global.fetch).toHaveBeenCalledWith(
      `${getApiBaseUrl()}/upload`,
      expect.objectContaining({
        method: 'POST',
        body: expect.any(FormData),
      }),
    );
    const init = (global.fetch as jest.Mock).mock.calls[0][1] as RequestInit;
    const fd = init.body as FormData;
    expect(fd.get('file')).toBe(file);
  });

  it('rejects with a useful message when response is not ok', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 400,
      text: async () => '{"error":"Invalid file type"}',
    } as Response);

    await expect(uploadCvFile(new File([], 'x.pdf', { type: 'application/pdf' }))).rejects.toThrow(/Invalid file type/);
  });

  it('rethrows TypeError from fetch with a hint about the API URL', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new TypeError('Failed to fetch'));
    await expect(uploadCvFile(new File([], 'x.pdf', { type: 'application/pdf' }))).rejects.toThrow(
      /Could not reach the API at/,
    );
  });
});

describe('createCandidate', () => {
  beforeEach(() => {
    jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      status: 201,
      json: async () => ({ message: 'ok', data: {} }),
    } as Response);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('POSTs JSON to /candidates and resolves on 201', async () => {
    await createCandidate(minimalPayload);

    expect(global.fetch).toHaveBeenCalledWith(
      `${getApiBaseUrl()}/candidates`,
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(minimalPayload),
      }),
    );
  });

  it('rejects with Datos inválidos when API returns 400 JSON with message', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 400,
      text: async () => JSON.stringify({ message: 'Email inválido', error: 'detail' }),
    } as Response);

    await expect(createCandidate(minimalPayload)).rejects.toThrow('Datos inválidos: Email inválido');
  });

  it('rejects on 500 with internal server error message', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
      text: async () => '',
    } as Response);

    await expect(createCandidate(minimalPayload)).rejects.toThrow('Error interno del servidor');
  });

  it('rejects on other non-ok statuses', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 418,
      text: async () => '',
    } as Response);

    await expect(createCandidate(minimalPayload)).rejects.toThrow('Error al enviar datos del candidato');
  });

  it('rethrows TypeError from fetch with a hint about the API URL', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new TypeError('Failed to fetch'));
    await expect(createCandidate(minimalPayload)).rejects.toThrow(/Could not reach the API at/);
  });

  it('uses non-JSON error body text when 400 response is not JSON', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 400,
      text: async () => 'plain-text failure',
    } as Response);

    await expect(createCandidate(minimalPayload)).rejects.toThrow('Datos inválidos: plain-text failure');
  });
});
