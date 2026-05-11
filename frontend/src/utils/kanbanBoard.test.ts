import {
  formatAverageScoreOneDecimal,
  groupCandidatesByInterviewSteps,
  sortInterviewSteps,
  stepIdForCandidateCardOver,
} from './kanbanBoard';

describe('sortInterviewSteps', () => {
  it('sorts by orderIndex then id', () => {
    const steps = [
      { id: 2, name: 'B', orderIndex: 2 },
      { id: 1, name: 'A', orderIndex: 1 },
      { id: 3, name: 'C', orderIndex: 2 },
    ];
    expect(sortInterviewSteps(steps).map((s) => s.id)).toEqual([1, 2, 3]);
  });
});

describe('formatAverageScoreOneDecimal', () => {
  it('uses exactly one decimal', () => {
    expect(formatAverageScoreOneDecimal(4)).toBe('4.0');
    expect(formatAverageScoreOneDecimal(3.666)).toBe('3.7');
  });
});

describe('groupCandidatesByInterviewSteps', () => {
  const steps = [
    { id: 10, name: 'Screen', orderIndex: 1 },
    { id: 20, name: 'Tech', orderIndex: 2 },
  ];

  it('places cards in matching columns and formats path for unknown', () => {
    const candidates = [
      {
        fullName: 'A A',
        currentInterviewStep: 'Screen',
        averageScore: 4,
        id: 1,
        applicationId: 101,
      },
      {
        fullName: 'B B',
        currentInterviewStep: 'Ghost Stage',
        averageScore: 3.7,
        id: 2,
        applicationId: 102,
      },
    ];
    const grouped = groupCandidatesByInterviewSteps(steps, candidates);
    expect(grouped.byStepId[10]).toHaveLength(1);
    expect(grouped.byStepId[10][0].fullName).toBe('A A');
    expect(grouped.unknown).toHaveLength(1);
    expect(grouped.unknown[0].id).toBe(2);
  });

  it('keeps empty columns visible in grouping', () => {
    const grouped = groupCandidatesByInterviewSteps(steps, []);
    expect(grouped.byStepId[10]).toEqual([]);
    expect(grouped.byStepId[20]).toEqual([]);
    expect(grouped.unknown).toEqual([]);
  });
});

describe('stepIdForCandidateCardOver', () => {
  it('resolves step id from column droppable', () => {
    const steps = [{ id: 5, name: 'S', orderIndex: 1 }];
    const grouped = groupCandidatesByInterviewSteps(steps, []);
    expect(stepIdForCandidateCardOver('step-5', grouped, steps)).toBe(5);
  });

  it('resolves step from card id in that column', () => {
    const steps = [{ id: 5, name: 'S', orderIndex: 1 }];
    const candidates = [
      {
        fullName: 'X',
        currentInterviewStep: 'S',
        averageScore: 1,
        id: 99,
        applicationId: 1,
      },
    ];
    const grouped = groupCandidatesByInterviewSteps(steps, candidates);
    expect(stepIdForCandidateCardOver('candidate-99', grouped, steps)).toBe(5);
  });

  it('returns null for malformed drop target ids', () => {
    const steps = [{ id: 5, name: 'S', orderIndex: 1 }];
    const grouped = groupCandidatesByInterviewSteps(steps, []);
    expect(stepIdForCandidateCardOver('step-abc', grouped, steps)).toBeNull();
    expect(stepIdForCandidateCardOver('candidate-xyz', grouped, steps)).toBeNull();
  });
});
