import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import PositionBoardPage from './PositionBoardPage';

const flowJson = {
  interviewFlow: {
    positionName: 'Engineering role',
    interviewFlow: {
      interviewSteps: [
        { id: 10, name: 'Screen', orderIndex: 1 },
        { id: 20, name: 'Tech', orderIndex: 2 },
      ],
    },
  },
};

function mockResponse(ok: boolean, body: unknown, status = 200) {
  return Promise.resolve({
    ok,
    status,
    text: async () => (typeof body === 'string' ? body : JSON.stringify(body)),
    json: async () => body,
  }) as Promise<Response>;
}

describe('PositionBoardPage', () => {
  beforeEach(() => {
    jest.spyOn(global, 'fetch').mockReset();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const renderAt = (path: string) =>
    render(
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="/positions/:positionId" element={<PositionBoardPage />} />
        </Routes>
      </MemoryRouter>,
    );

  it('shows shell with back link to /positions', async () => {
    (global.fetch as jest.Mock).mockImplementation((url: string) => {
      if (url.includes('interviewflow')) return mockResponse(true, flowJson);
      if (url.includes('candidates')) return mockResponse(true, []);
      return mockResponse(false, {}, 404);
    });
    renderAt('/positions/1');
    const back = await screen.findByRole('link', { name: /back/i });
    expect(back.getAttribute('href')).toBe('/positions');
  });

  it('shows full-page error when interview flow fails', async () => {
    (global.fetch as jest.Mock).mockImplementation((url: string) => {
      if (url.includes('interviewflow')) return mockResponse(false, {}, 500);
      return mockResponse(true, []);
    });
    renderAt('/positions/1');
    expect(await screen.findByRole('alert')).toBeTruthy();
    expect(screen.queryByTestId('kanban-board')).toBeNull();
    expect(screen.getByRole('button', { name: /retry/i })).toBeTruthy();
  });

  it('shows columns and candidates error strip when only candidates fail', async () => {
    (global.fetch as jest.Mock).mockImplementation((url: string) => {
      if (url.includes('interviewflow')) return mockResponse(true, flowJson);
      if (url.includes('candidates')) return mockResponse(false, {}, 500);
      return mockResponse(false, {}, 404);
    });
    renderAt('/positions/1');
    expect(await screen.findByTestId('kanban-column-10')).toBeTruthy();
    expect(await screen.findByRole('alert')).toBeTruthy();
    expect(screen.getByRole('alert').textContent).toMatch(/candidates/i);
    expect(screen.getByRole('button', { name: /retry candidates/i })).toBeTruthy();
  });

  it('renders cards in expected columns and unknown lane', async () => {
    (global.fetch as jest.Mock).mockImplementation((url: string) => {
      if (url.includes('interviewflow')) return mockResponse(true, flowJson);
      if (url.includes('candidates')) {
        return mockResponse(true, [
          {
            fullName: 'Pat Candidate',
            currentInterviewStep: 'Screen',
            averageScore: 4,
            id: 1,
            applicationId: 11,
          },
          {
            fullName: 'Odd Name',
            currentInterviewStep: 'Not a real step',
            averageScore: 3.666,
            id: 2,
            applicationId: 12,
          },
        ]);
      }
      return mockResponse(false, {}, 404);
    });
    renderAt('/positions/7');
    expect(await screen.findByText('Pat Candidate')).toBeTruthy();
    const colScreen = screen.getByTestId('kanban-column-10');
    expect(colScreen.textContent).toContain('Pat Candidate');
    expect(colScreen.textContent).toContain('Score: 4.0');
    const unknown = screen.getByTestId('kanban-unknown-lane');
    expect(unknown.textContent).toContain('Odd Name');
    expect(unknown.textContent).toContain('Score: 3.7');
  });

  it('retries candidates only when that request failed', async () => {
    let candidatesCalls = 0;
    (global.fetch as jest.Mock).mockImplementation((url: string) => {
      if (url.includes('interviewflow')) return mockResponse(true, flowJson);
      if (url.includes('candidates')) {
        candidatesCalls += 1;
        if (candidatesCalls === 1) return mockResponse(false, {}, 500);
        return mockResponse(true, []);
      }
      return mockResponse(false, {}, 404);
    });
    renderAt('/positions/1');
    await screen.findByRole('button', { name: /retry candidates/i });
    const flowCalls = (global.fetch as jest.Mock).mock.calls.filter((c) =>
      String(c[0]).includes('interviewflow'),
    ).length;
    await userEvent.click(screen.getByRole('button', { name: /retry candidates/i }));
    await waitFor(() => {
      expect(
        (global.fetch as jest.Mock).mock.calls.filter((c) => String(c[0]).includes('interviewflow'))
          .length,
      ).toBe(flowCalls);
    });
    expect(candidatesCalls).toBeGreaterThanOrEqual(2);
  });
});
