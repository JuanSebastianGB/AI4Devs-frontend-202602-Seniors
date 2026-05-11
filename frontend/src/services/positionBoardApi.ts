import { getApiBaseUrl } from '../apiConfig';
import type { InterviewStepDTO, PositionCandidateRow } from '../utils/kanbanBoard';

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

export type NormalizedInterviewFlow = {
  positionName: string;
  steps: InterviewStepDTO[];
};

type ApiInterviewFlowResponse = {
  interviewFlow: {
    positionName: string;
    interviewFlow: {
      interviewSteps: InterviewStepDTO[];
    };
  };
};

export function normalizeInterviewFlowPayload(body: unknown): NormalizedInterviewFlow {
  const data = body as ApiInterviewFlowResponse;
  const inner = data.interviewFlow;
  return {
    positionName: inner.positionName,
    steps: inner.interviewFlow.interviewSteps,
  };
}

export async function fetchInterviewFlowForPosition(positionId: number): Promise<NormalizedInterviewFlow> {
  const res = await fetchOrExplainNetwork(`${getApiBaseUrl()}/position/${positionId}/interviewflow`);
  if (!res.ok) {
    throw new Error(`Interview flow request failed: ${res.status}`);
  }
  const json: unknown = await res.json();
  return normalizeInterviewFlowPayload(json);
}

export async function fetchCandidatesForPosition(positionId: number): Promise<PositionCandidateRow[]> {
  const res = await fetchOrExplainNetwork(`${getApiBaseUrl()}/position/${positionId}/candidates`);
  if (!res.ok) {
    throw new Error(`Candidates request failed: ${res.status}`);
  }
  return (await res.json()) as PositionCandidateRow[];
}

export async function putCandidateInterviewStage(
  candidateId: number,
  applicationId: number,
  currentInterviewStep: number,
): Promise<void> {
  const res = await fetchOrExplainNetwork(`${getApiBaseUrl()}/candidates/${candidateId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ applicationId, currentInterviewStep }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Stage update failed: ${res.status}`);
  }
}
