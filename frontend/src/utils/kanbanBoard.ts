export type InterviewStepDTO = {
  id: number;
  name: string;
  orderIndex: number;
};

export type PositionCandidateRow = {
  fullName: string;
  currentInterviewStep: string;
  averageScore: number;
  id: number;
  applicationId: number;
};

export function sortInterviewSteps(steps: InterviewStepDTO[]): InterviewStepDTO[] {
  return [...steps].sort((a, b) => {
    if (a.orderIndex !== b.orderIndex) return a.orderIndex - b.orderIndex;
    return a.id - b.id;
  });
}

export function formatAverageScoreOneDecimal(score: number): string {
  return score.toFixed(1);
}

export type GroupedCandidates = {
  byStepId: Record<number, PositionCandidateRow[]>;
  unknown: PositionCandidateRow[];
};

export function groupCandidatesByInterviewSteps(
  steps: InterviewStepDTO[],
  candidates: PositionCandidateRow[],
): GroupedCandidates {
  const ordered = sortInterviewSteps(steps);
  const nameToStepId = new Map(ordered.map((s) => [s.name, s.id]));
  const byStepId: Record<number, PositionCandidateRow[]> = {};
  for (const s of ordered) {
    byStepId[s.id] = [];
  }
  const unknown: PositionCandidateRow[] = [];
  for (const c of candidates) {
    const stepId = nameToStepId.get(c.currentInterviewStep);
    if (stepId === undefined) {
      unknown.push(c);
    } else {
      byStepId[stepId].push(c);
    }
  }
  return { byStepId, unknown };
}

export function stepIdForCandidateCardOver(
  overId: string,
  grouped: GroupedCandidates,
  sortedSteps: InterviewStepDTO[],
): number | null {
  if (overId.startsWith('step-')) {
    return parseInt(overId.slice('step-'.length), 10);
  }
  if (overId.startsWith('candidate-')) {
    const candidateId = parseInt(overId.slice('candidate-'.length), 10);
    for (const s of sortedSteps) {
      if (grouped.byStepId[s.id]?.some((c) => c.id === candidateId)) {
        return s.id;
      }
    }
  }
  return null;
}
