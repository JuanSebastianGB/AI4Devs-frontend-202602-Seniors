import { getApiBaseUrl } from '../apiConfig';
import { fetchInterviewFlowForPosition, putCandidateInterviewStage } from './positionBoardApi';

describe('putCandidateInterviewStage', () => {
  beforeEach(() => {
    jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      status: 200,
      text: async () => '',
    } as Response);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('rethrows network errors with a hint about the API URL', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new TypeError('Failed to fetch'));
    await expect(fetchInterviewFlowForPosition(1)).rejects.toThrow(/Could not reach the API at/);
  });

  it('sends PUT with applicationId and numeric currentInterviewStep', async () => {
    await putCandidateInterviewStage(5, 99, 12);
    expect(global.fetch).toHaveBeenCalledWith(
      `${getApiBaseUrl()}/candidates/5`,
      expect.objectContaining({
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationId: 99, currentInterviewStep: 12 }),
      }),
    );
  });
});
