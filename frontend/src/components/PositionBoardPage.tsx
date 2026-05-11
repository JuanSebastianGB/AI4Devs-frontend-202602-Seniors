import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, Button, Card, Container, Spinner } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  fetchCandidatesForPosition,
  fetchInterviewFlowForPosition,
  putCandidateInterviewStage,
} from '../services/positionBoardApi';
import { runOptimisticStageChange } from '../services/persistStageChange';
import {
  formatAverageScoreOneDecimal,
  groupCandidatesByInterviewSteps,
  sortInterviewSteps,
  stepIdForCandidateCardOver,
  type InterviewStepDTO,
  type PositionCandidateRow,
} from '../utils/kanbanBoard';

type FlowState =
  | { status: 'idle' | 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ok'; positionName: string; steps: InterviewStepDTO[] };

type CandidatesState =
  | { status: 'idle' | 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ok'; rows: PositionCandidateRow[] };

function KanbanCard(props: { candidate: PositionCandidateRow }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `candidate-${props.candidate.id}`,
  });
  const style = transform
    ? { transform: `translate3d(${transform.x}px,${transform.y}px,0)`, opacity: isDragging ? 0.5 : 1 }
    : undefined;

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className="mb-2 shadow-sm"
      {...listeners}
      {...attributes}
    >
      <Card.Body className="py-2 px-3">
        <div className="fw-semibold">{props.candidate.fullName}</div>
        <div className="text-muted small">Score: {formatAverageScoreOneDecimal(props.candidate.averageScore)}</div>
      </Card.Body>
    </Card>
  );
}

function KanbanColumn(props: {
  step: InterviewStepDTO;
  candidates: PositionCandidateRow[];
}) {
  const { setNodeRef, isOver } = useDroppable({ id: `step-${props.step.id}` });
  return (
    <div
      ref={setNodeRef}
      className={`flex-shrink-0 border rounded p-2 bg-light ${isOver ? 'border-primary' : ''}`}
      style={{ minWidth: 260, maxWidth: 320 }}
      data-testid={`kanban-column-${props.step.id}`}
    >
      <div className="fw-semibold mb-2">{props.step.name}</div>
      <div>
        {props.candidates.map((c) => (
          <KanbanCard key={c.id} candidate={c} />
        ))}
      </div>
    </div>
  );
}

function UnknownLane(props: { candidates: PositionCandidateRow[] }) {
  if (props.candidates.length === 0) return null;
  return (
    <div
      className="flex-shrink-0 border border-warning rounded p-2 bg-warning bg-opacity-10"
      style={{ minWidth: 260, maxWidth: 320 }}
      data-testid="kanban-unknown-lane"
    >
      <div className="fw-semibold mb-2 text-warning-emphasis">
        Unknown <span className="badge bg-warning text-dark ms-1">Unmatched stage</span>
      </div>
      <div>
        {props.candidates.map((c) => (
          <KanbanCard key={c.id} candidate={c} />
        ))}
      </div>
    </div>
  );
}

const PositionBoardPage: React.FC = () => {
  const { positionId: positionIdParam } = useParams();
  const positionId = positionIdParam ? parseInt(positionIdParam, 10) : NaN;

  const [flow, setFlow] = useState<FlowState>({ status: 'idle' });
  const [candidatesState, setCandidatesState] = useState<CandidatesState>({ status: 'idle' });
  const [activeDrag, setActiveDrag] = useState<PositionCandidateRow | null>(null);
  const [stageError, setStageError] = useState<string | null>(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  const loadFlow = useCallback(async () => {
    if (Number.isNaN(positionId)) {
      setFlow({ status: 'error', message: 'Invalid position id' });
      return;
    }
    setFlow({ status: 'loading' });
    setCandidatesState({ status: 'idle' });
    try {
      const data = await fetchInterviewFlowForPosition(positionId);
      setFlow({ status: 'ok', positionName: data.positionName, steps: data.steps });
      setCandidatesState({ status: 'loading' });
      try {
        const rows = await fetchCandidatesForPosition(positionId);
        setCandidatesState({ status: 'ok', rows });
      } catch (e) {
        setCandidatesState({
          status: 'error',
          message: e instanceof Error ? e.message : 'Failed to load candidates',
        });
      }
    } catch (e) {
      setFlow({
        status: 'error',
        message: e instanceof Error ? e.message : 'Failed to load interview flow',
      });
    }
  }, [positionId]);

  const loadCandidatesOnly = useCallback(async () => {
    if (Number.isNaN(positionId)) return;
    setCandidatesState({ status: 'loading' });
    try {
      const rows = await fetchCandidatesForPosition(positionId);
      setCandidatesState({ status: 'ok', rows });
    } catch (e) {
      setCandidatesState({
        status: 'error',
        message: e instanceof Error ? e.message : 'Failed to load candidates',
      });
    }
  }, [positionId]);

  useEffect(() => {
    void loadFlow();
  }, [loadFlow]);

  const sortedSteps = useMemo(() => {
    if (flow.status !== 'ok') return [];
    return sortInterviewSteps(flow.steps);
  }, [flow]);

  const candidateRows: PositionCandidateRow[] =
    candidatesState.status === 'ok' ? candidatesState.rows : [];

  const grouped = useMemo(
    () => groupCandidatesByInterviewSteps(sortedSteps, candidateRows),
    [sortedSteps, candidateRows],
  );

  const title =
    flow.status === 'ok'
      ? flow.positionName
      : flow.status === 'loading'
        ? 'Loading…'
        : 'Position';

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveDrag(null);
    setStageError(null);
    if (flow.status !== 'ok' || candidatesState.status !== 'ok') return;
    const { active, over } = event;
    if (!over) return;
    const activeId = String(active.id);
    if (!activeId.startsWith('candidate-')) return;
    const candidateId = parseInt(activeId.slice('candidate-'.length), 10);
    const targetStepId = stepIdForCandidateCardOver(String(over.id), grouped, sortedSteps);
    if (targetStepId === null) return;

    const candidate = candidatesState.rows.find((c) => c.id === candidateId);
    if (!candidate) return;
    const targetStep = sortedSteps.find((s) => s.id === targetStepId);
    if (!targetStep) return;
    if (candidate.currentInterviewStep === targetStep.name) return;

    const previousRows = candidatesState.rows;
    const applyOptimistic = () => {
      setCandidatesState({
        status: 'ok',
        rows: previousRows.map((r) =>
          r.id === candidateId ? { ...r, currentInterviewStep: targetStep.name } : r,
        ),
      });
    };
    const rollback = () => {
      setCandidatesState({ status: 'ok', rows: previousRows });
    };

    await runOptimisticStageChange({
      applyOptimistic,
      rollback,
      persist: () =>
        putCandidateInterviewStage(candidateId, candidate.applicationId, targetStepId),
      refetch: () => fetchCandidatesForPosition(positionId),
      onSuccess: (rows) => setCandidatesState({ status: 'ok', rows }),
      onFailure: (err) => {
        setStageError(err.message);
      },
    });
  };

  if (flow.status === 'error') {
    return (
      <Container className="mt-4">
        <Alert variant="danger">
          <div className="mb-2">{flow.message}</div>
          <Button variant="outline-danger" onClick={() => void loadFlow()}>
            Retry
          </Button>
        </Alert>
        <Link to="/positions">Back to positions</Link>
      </Container>
    );
  }

  return (
    <Container fluid className="mt-3 px-3">
      <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
        <div>
          <Link to="/positions" className="btn btn-link ps-0">
            ← Back
          </Link>
          <h1 className="h4 mb-0 d-inline ms-2" data-testid="position-board-title">
            {title}
          </h1>
        </div>
      </div>

      {flow.status === 'loading' && (
        <div className="d-flex align-items-center gap-2">
          <Spinner animation="border" size="sm" />
          <span>Loading interview flow…</span>
        </div>
      )}

      {flow.status === 'ok' && (
        <>
          {candidatesState.status === 'loading' && (
            <div className="d-flex align-items-center gap-2 mb-2">
              <Spinner animation="border" size="sm" />
              <span>Loading candidates…</span>
            </div>
          )}

          {candidatesState.status === 'error' && (
            <Alert variant="warning" className="d-flex align-items-center justify-content-between flex-wrap gap-2">
              <span>{candidatesState.message}</span>
              <Button size="sm" variant="outline-warning" onClick={() => void loadCandidatesOnly()}>
                Retry candidates
              </Button>
            </Alert>
          )}

          {stageError && (
            <Alert variant="danger" dismissible onClose={() => setStageError(null)}>
              {stageError}
            </Alert>
          )}

          <DndContext
            sensors={sensors}
            onDragStart={(e) => {
              const id = String(e.active.id);
              if (id.startsWith('candidate-')) {
                const cid = parseInt(id.slice('candidate-'.length), 10);
                const row = candidateRows.find((r) => r.id === cid);
                if (row) setActiveDrag(row);
              }
            }}
            onDragCancel={() => setActiveDrag(null)}
            onDragEnd={(e) => void handleDragEnd(e)}
          >
            <div
              className="d-flex flex-column flex-md-row flex-md-nowrap gap-3 pb-4 overflow-auto"
              data-testid="kanban-board"
            >
              {sortedSteps.map((step) => (
                <KanbanColumn
                  key={step.id}
                  step={step}
                  candidates={
                    candidatesState.status === 'ok' ? grouped.byStepId[step.id] ?? [] : []
                  }
                />
              ))}
              <UnknownLane
                candidates={candidatesState.status === 'ok' ? grouped.unknown : []}
              />
            </div>
            <DragOverlay>
              {activeDrag ? (
                <Card className="shadow">
                  <Card.Body className="py-2 px-3">
                    <div className="fw-semibold">{activeDrag.fullName}</div>
                    <div className="text-muted small">
                      Score: {formatAverageScoreOneDecimal(activeDrag.averageScore)}
                    </div>
                  </Card.Body>
                </Card>
              ) : null}
            </DragOverlay>
          </DndContext>
        </>
      )}
    </Container>
  );
};

export default PositionBoardPage;
