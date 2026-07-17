import { type FormEvent, useCallback, useEffect, useState } from "react";
import {
  CalendarClock,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  ExternalLink,
  LoaderCircle,
  MessageSquareText,
  Plus,
  Sparkles,
  X,
} from "lucide-react";
import type {
  Candidate,
  CandidatesResponse,
  Interview,
  InterviewFeedbackRequest,
  InterviewRecommendation,
  InterviewResponse,
  InterviewsResponse,
  InterviewStage,
  InterviewStatus,
  ScheduleInterviewRequest,
} from "@recruiterai/contracts";
import { ApiRequestError, apiRequest } from "../lib/api";
import "./interview-operations.css";

const stageLabels: Record<InterviewStage, string> = {
  SCREENING: "Screening",
  TECHNICAL: "Technical",
  MANAGER: "Manager",
  FINAL: "Final",
};

export function InterviewOperations({
  accessToken,
  refreshKey,
}: {
  accessToken: string;
  refreshKey: number;
}) {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [summary, setSummary] = useState({ upcoming: 0, completed: 0, feedbackPending: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [feedbackInterview, setFeedbackInterview] = useState<Interview | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);

  const loadOperations = useCallback(async () => {
    setLoading(true);
    try {
      const [interviewResponse, candidateResponse] = await Promise.all([
        apiRequest<InterviewsResponse>("/interviews", {
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
        apiRequest<CandidatesResponse>("/candidates", {
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
      ]);
      setInterviews(interviewResponse.data.interviews);
      setSummary(interviewResponse.data.summary);
      setCandidates(candidateResponse.data.candidates);
      setError(null);
    } catch (requestError) {
      setError(
        requestError instanceof ApiRequestError
          ? requestError.message
          : "Could not load interview operations",
      );
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    void loadOperations();
  }, [loadOperations, refreshKey]);

  const updateStatus = async (interview: Interview, status: InterviewStatus) => {
    setSavingId(interview.id);
    try {
      await apiRequest<InterviewResponse>(`/interviews/${interview.id}/status`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({ status }),
      });
      await loadOperations();
    } catch (requestError) {
      setError(
        requestError instanceof ApiRequestError
          ? requestError.message
          : "Could not update the interview",
      );
    } finally {
      setSavingId(null);
    }
  };

  return (
    <section className="interview-section" id="interview-operations">
      <div className="interview-heading">
        <div>
          <span>Interview operations</span>
          <h2>Schedule and evaluate</h2>
          <p>Coordinate interviews, use structured questions, and capture consistent feedback.</p>
        </div>
        <button
          className="workspace-primary"
          disabled={candidates.length === 0}
          onClick={() => setScheduleOpen(true)}
        >
          <Plus size={16} /> Schedule interview
        </button>
      </div>

      <div className="interview-summary">
        <article>
          <CalendarClock size={17} />
          <strong>{summary.upcoming}</strong>
          <span>Upcoming</span>
        </article>
        <article>
          <CheckCircle2 size={17} />
          <strong>{summary.completed}</strong>
          <span>Completed</span>
        </article>
        <article>
          <MessageSquareText size={17} />
          <strong>{summary.feedbackPending}</strong>
          <span>Feedback pending</span>
        </article>
      </div>

      <div className="interview-panel">
        {error && <div className="workspace-error">{error}</div>}
        {loading ? (
          <div className="workspace-state">
            <LoaderCircle className="workspace-spin" size={22} /> Loading interviews…
          </div>
        ) : interviews.length === 0 ? (
          <div className="interview-empty">
            <CalendarClock size={25} />
            <h3>No interviews scheduled</h3>
            <p>Schedule a candidate to generate a structured question kit.</p>
          </div>
        ) : (
          <div className="interview-list">
            {interviews.map((interview) => (
              <article className="interview-card" key={interview.id}>
                <div className="interview-card__date">
                  <strong>
                    {new Date(interview.scheduledAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                    })}
                  </strong>
                  <span>
                    {new Date(interview.scheduledAt).toLocaleDateString("en-IN", {
                      month: "short",
                    })}
                  </span>
                </div>
                <div className="interview-card__main">
                  <div>
                    <h3>{interview.candidateName}</h3>
                    <span
                      className={`interview-status interview-status--${interview.status.toLowerCase()}`}
                    >
                      {interview.status.toLowerCase()}
                    </span>
                  </div>
                  <p>
                    {interview.jobTitle} · {stageLabels[interview.stage]}
                  </p>
                  <small>
                    <Clock3 size={12} /> {new Date(interview.scheduledAt).toLocaleString("en-IN")} ·{" "}
                    {interview.durationMinutes} min
                  </small>
                </div>
                <details className="question-kit">
                  <summary>
                    <ClipboardCheck size={14} /> Question kit ({interview.questions.length})
                  </summary>
                  <ol>
                    {interview.questions.map((question) => (
                      <li key={question}>{question}</li>
                    ))}
                  </ol>
                </details>
                <div className="interview-card__actions">
                  {interview.meetingUrl && (
                    <a href={interview.meetingUrl} target="_blank" rel="noreferrer">
                      <ExternalLink size={14} /> Join
                    </a>
                  )}
                  {interview.status === "SCHEDULED" && (
                    <>
                      <button
                        disabled={savingId === interview.id}
                        onClick={() => void updateStatus(interview, "COMPLETED")}
                      >
                        Complete
                      </button>
                      <button
                        disabled={savingId === interview.id}
                        onClick={() => void updateStatus(interview, "CANCELLED")}
                      >
                        Cancel
                      </button>
                    </>
                  )}
                  {interview.status === "COMPLETED" && (
                    <button onClick={() => setFeedbackInterview(interview)}>
                      <MessageSquareText size={14} />{" "}
                      {interview.feedback ? "Edit feedback" : "Add feedback"}
                    </button>
                  )}
                </div>
                {interview.feedback && (
                  <div className="feedback-summary">
                    <Sparkles size={14} />
                    <strong>
                      {interview.feedback.rating}/5 ·{" "}
                      {interview.feedback.recommendation.replaceAll("_", " ")}
                    </strong>
                    <span>{interview.feedback.strengths}</span>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </div>

      {scheduleOpen && (
        <ScheduleEditor
          accessToken={accessToken}
          candidates={candidates}
          onClose={() => setScheduleOpen(false)}
          onSaved={async () => {
            setScheduleOpen(false);
            await loadOperations();
          }}
        />
      )}
      {feedbackInterview && (
        <FeedbackEditor
          accessToken={accessToken}
          interview={feedbackInterview}
          onClose={() => setFeedbackInterview(null)}
          onSaved={async () => {
            setFeedbackInterview(null);
            await loadOperations();
          }}
        />
      )}
    </section>
  );
}

function ScheduleEditor({
  accessToken,
  candidates,
  onClose,
  onSaved,
}: {
  accessToken: string;
  candidates: Candidate[];
  onClose(): void;
  onSaved(): Promise<void>;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    const values = new FormData(event.currentTarget);
    const input: ScheduleInterviewRequest = {
      candidateId: String(values.get("candidateId")),
      stage: String(values.get("stage")) as InterviewStage,
      scheduledAt: new Date(String(values.get("scheduledAt"))).toISOString(),
      durationMinutes: Number(values.get("durationMinutes")),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      meetingUrl: String(values.get("meetingUrl")),
      notes: String(values.get("notes")),
    };
    try {
      await apiRequest<InterviewResponse>("/interviews", {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify(input),
      });
      await onSaved();
    } catch (requestError) {
      setError(
        requestError instanceof ApiRequestError
          ? requestError.message
          : "Could not schedule interview",
      );
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <OperationModal title="Schedule interview" eyebrow="Local calendar" onClose={onClose}>
      <form className="operation-form" onSubmit={submit}>
        <label>
          <span>Candidate</span>
          <select required name="candidateId" defaultValue="">
            <option value="" disabled>
              Select candidate
            </option>
            {candidates.map((candidate) => (
              <option key={candidate.id} value={candidate.id}>
                {candidate.name} · {candidate.jobTitle}
              </option>
            ))}
          </select>
        </label>
        <div className="operation-grid">
          <label>
            <span>Stage</span>
            <select name="stage" defaultValue="TECHNICAL">
              {Object.entries(stageLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>Duration</span>
            <select name="durationMinutes" defaultValue="60">
              <option value="30">30 minutes</option>
              <option value="45">45 minutes</option>
              <option value="60">60 minutes</option>
              <option value="90">90 minutes</option>
            </select>
          </label>
        </div>
        <label>
          <span>Date and time</span>
          <input required name="scheduledAt" type="datetime-local" />
        </label>
        <label>
          <span>Meeting URL (optional)</span>
          <input name="meetingUrl" type="url" placeholder="https://meet.google.com/..." />
        </label>
        <label>
          <span>Internal notes</span>
          <textarea name="notes" rows={3} />
        </label>
        {error && <div className="workspace-error">{error}</div>}
        <footer>
          <button type="button" className="workspace-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="workspace-primary" disabled={submitting}>
            {submitting && <LoaderCircle className="workspace-spin" size={15} />} Schedule
          </button>
        </footer>
      </form>
    </OperationModal>
  );
}

function FeedbackEditor({
  accessToken,
  interview,
  onClose,
  onSaved,
}: {
  accessToken: string;
  interview: Interview;
  onClose(): void;
  onSaved(): Promise<void>;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    const values = new FormData(event.currentTarget);
    const input: InterviewFeedbackRequest = {
      rating: Number(values.get("rating")),
      recommendation: String(values.get("recommendation")) as InterviewRecommendation,
      strengths: String(values.get("strengths")),
      concerns: String(values.get("concerns")),
      notes: String(values.get("notes")),
    };
    try {
      await apiRequest<InterviewResponse>(`/interviews/${interview.id}/feedback`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify(input),
      });
      await onSaved();
    } catch (requestError) {
      setError(
        requestError instanceof ApiRequestError ? requestError.message : "Could not save feedback",
      );
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <OperationModal
      title={`Feedback · ${interview.candidateName}`}
      eyebrow={stageLabels[interview.stage]}
      onClose={onClose}
    >
      <form className="operation-form" onSubmit={submit}>
        <div className="operation-grid">
          <label>
            <span>Rating</span>
            <select name="rating" defaultValue={interview.feedback?.rating ?? 4}>
              {[1, 2, 3, 4, 5].map((value) => (
                <option key={value} value={value}>
                  {value} / 5
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>Recommendation</span>
            <select
              name="recommendation"
              defaultValue={interview.feedback?.recommendation ?? "YES"}
            >
              <option value="STRONG_YES">Strong yes</option>
              <option value="YES">Yes</option>
              <option value="MIXED">Mixed</option>
              <option value="NO">No</option>
              <option value="STRONG_NO">Strong no</option>
            </select>
          </label>
        </div>
        <label>
          <span>Demonstrated strengths</span>
          <textarea
            required
            minLength={3}
            name="strengths"
            rows={3}
            defaultValue={interview.feedback?.strengths}
          />
        </label>
        <label>
          <span>Concerns</span>
          <textarea name="concerns" rows={2} defaultValue={interview.feedback?.concerns} />
        </label>
        <label>
          <span>Additional notes</span>
          <textarea name="notes" rows={3} defaultValue={interview.feedback?.notes} />
        </label>
        {error && <div className="workspace-error">{error}</div>}
        <footer>
          <button type="button" className="workspace-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="workspace-primary" disabled={submitting}>
            {submitting && <LoaderCircle className="workspace-spin" size={15} />} Save feedback
          </button>
        </footer>
      </form>
    </OperationModal>
  );
}

function OperationModal({
  children,
  eyebrow,
  onClose,
  title,
}: {
  children: React.ReactNode;
  eyebrow: string;
  onClose(): void;
  title: string;
}) {
  return (
    <div className="operation-modal">
      <button
        aria-label="Close operations dialog"
        className="operation-modal__backdrop"
        onClick={onClose}
      />
      <section role="dialog" aria-modal="true" aria-labelledby="operation-title">
        <header>
          <div>
            <span>{eyebrow}</span>
            <h2 id="operation-title">{title}</h2>
          </div>
          <button aria-label="Close" onClick={onClose}>
            <X size={18} />
          </button>
        </header>
        {children}
      </section>
    </div>
  );
}
