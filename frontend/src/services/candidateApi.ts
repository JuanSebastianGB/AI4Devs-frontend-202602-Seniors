import { getApiBaseUrl } from '../apiConfig';

export type CvUploadResult = {
  filePath: string;
  fileType: string;
};

export type CreateCandidateCvPayload = {
  filePath: string;
  fileType: string;
} | null;

export type CreateCandidateEducation = {
  institution: string;
  title: string;
  startDate: string;
  endDate: string;
};

export type CreateCandidateWorkExperience = {
  company: string;
  position: string;
  description: string;
  startDate: string;
  endDate: string;
};

/** JSON body for POST /candidates after date normalization in the form. */
export type CreateCandidatePayload = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  educations: CreateCandidateEducation[];
  workExperiences: CreateCandidateWorkExperience[];
  cv: CreateCandidateCvPayload;
};

async function fetchOrExplainNetwork(url: string, init?: RequestInit): Promise<Response> {
  try {
    return await fetch(url, init);
  } catch (e) {
    if (e instanceof TypeError) {
      throw new Error(
        `Could not reach the API at ${getApiBaseUrl()} (network error: ${e.message}). ` +
          'Start the backend (default port 3010), ensure PostgreSQL is running with DATABASE_URL, ' +
          'and set REACT_APP_API_URL in frontend/.env if the API is not on localhost:3010.',
      );
    }
    throw e;
  }
}

async function readResponseErrorDetail(res: Response): Promise<string> {
  const text = await res.text();
  try {
    const data = JSON.parse(text) as { message?: unknown; error?: unknown };
    if (typeof data.message === 'string') return data.message;
    if (typeof data.error === 'string') return data.error;
  } catch {
    /* body is not JSON */
  }
  return text.trim();
}

function parseCvUploadResult(body: unknown): CvUploadResult {
  if (
    body &&
    typeof body === 'object' &&
    'filePath' in body &&
    'fileType' in body &&
    typeof (body as CvUploadResult).filePath === 'string' &&
    typeof (body as CvUploadResult).fileType === 'string'
  ) {
    return {
      filePath: (body as CvUploadResult).filePath,
      fileType: (body as CvUploadResult).fileType,
    };
  }
  throw new Error('Unexpected upload response shape');
}

export async function uploadCvFile(file: File): Promise<CvUploadResult> {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetchOrExplainNetwork(`${getApiBaseUrl()}/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const detail = await readResponseErrorDetail(res);
    throw new Error(detail ? `Upload failed (${res.status}): ${detail}` : `Upload failed: ${res.status}`);
  }

  const json: unknown = await res.json();
  return parseCvUploadResult(json);
}

export async function createCandidate(payload: CreateCandidatePayload): Promise<void> {
  const res = await fetchOrExplainNetwork(`${getApiBaseUrl()}/candidates`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (res.ok && res.status === 201) {
    await res.json();
    return;
  }

  const detail = await readResponseErrorDetail(res);

  if (res.status === 400) {
    throw new Error(`Datos inválidos: ${detail || 'solicitud incorrecta'}`);
  }
  if (res.status === 500) {
    throw new Error('Error interno del servidor');
  }
  throw new Error('Error al enviar datos del candidato');
}
