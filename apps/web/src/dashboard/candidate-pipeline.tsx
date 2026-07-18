import { type FormEvent, useCallback, useEffect, useState } from "react";
import {
  BriefcaseBusiness,
  BrainCircuit,
  CheckCircle2,
  FileText,
  LoaderCircle,
  MapPin,
  Plus,
  Search,
  ShieldCheck,
  UploadCloud,
  UserRoundSearch,
  Users,
  X,
} from "lucide-react";
import type {
  Candidate,
  CandidateMatch,
  CandidateMatchesResponse,
  CandidateMatchResponse,
  CandidateResponse,
  CandidatesResponse,
  CandidateStatus,
  CreateCandidateRequest,
  Job,
} from "@recruiterai/contracts";
import { ApiRequestError, apiRequest } from "../lib/api";
import "./candidate-pipeline.css";

const statusLabels: Record<CandidateStatus, string> = {
  APPLIED: "Applied",
  SCREENING: "Screening",
  INTERVIEW: "Interview",
  OFFER: "Offer",
  HIRED: "Hired",
  REJECTED: "Rejected",
};

export function CandidatePipeline({
  accessToken,
  jobs,
  onCandidateChanged,
  refreshKey,
}: {
  accessToken: string;
  jobs: Job[];
  onCandidateChanged(): Promise<void>;
  refreshKey: number;
}) {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [matches, setMatches] = useState<Record<string, CandidateMatch>>({});
  const [summary, setSummary] = useState({ total: 0, screening: 0, interviews: 0, hired: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [editorOpen, setEditorOpen] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);

  const loadCandidates = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [candidateResponse, matchResponse] = await Promise.all([
        apiRequest<CandidatesResponse>("/candidates", {
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
        apiRequest<CandidateMatchesResponse>("/matches", {
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
      ]);
      setCandidates(candidateResponse.data.candidates);
      setSummary(candidateResponse.data.summary);
      setMatches(
        Object.fromEntries(matchResponse.data.matches.map((match) => [match.candidateId, match])),
      );
    } catch (requestError) {
      setError(
        requestError instanceof ApiRequestError
          ? requestError.message
          : "Could not load candidates",
      );
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    void loadCandidates();
  }, [loadCandidates, refreshKey]);

  const updateStatus = async (candidate: Candidate, status: CandidateStatus) => {
    setSavingId(candidate.id);
    setError(null);
    try {
      const response = await apiRequest<CandidateResponse>(`/candidates/${candidate.id}/status`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({ status }),
      });
      setCandidates((current) =>
        current.map((item) => (item.id === candidate.id ? response.data.candidate : item)),
      );
      await Promise.all([loadCandidates(), onCandidateChanged()]);
    } catch (requestError) {
      setError(
        requestError instanceof ApiRequestError
          ? requestError.message
          : "Could not update candidate status",
      );
    } finally {
      setSavingId(null);
    }
  };

  const analyzeCandidate = async (candidate: Candidate) => {
    setSavingId(candidate.id);
    setError(null);
    try {
      const response = await apiRequest<CandidateMatchResponse>(
        `/matches/candidates/${candidate.id}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );
      setMatches((current) => ({ ...current, [candidate.id]: response.data.match }));
      await onCandidateChanged();
    } catch (requestError) {
      setError(
        requestError instanceof ApiRequestError
          ? requestError.message
          : "Could not analyze candidate match",
      );
    } finally {
      setSavingId(null);
    }
  };

  const filteredCandidates = candidates.filter((candidate) => {
    const value = query.toLowerCase();
    return (
      candidate.name.toLowerCase().includes(value) ||
      candidate.email.toLowerCase().includes(value) ||
      candidate.jobTitle.toLowerCase().includes(value) ||
      candidate.skills.some((skill) => skill.toLowerCase().includes(value))
    );
  });

  return (
    <section className="candidate-section" id="candidate-pipeline">
      <div className="candidate-section__heading">
        <div>
          <span>Talent pipeline</span>
          <h2>Candidates</h2>
          <p>Upload resumes, assign candidates to roles, and manage hiring stages.</p>
        </div>
        <button
          className="workspace-primary"
          disabled={jobs.length === 0}
          onClick={() => setEditorOpen(true)}
          title={jobs.length === 0 ? "Create a job before adding candidates" : undefined}
        >
          <Plus size={17} /> Add candidate
        </button>
      </div>

      <div className="candidate-summary">
        <CandidateMetric icon={Users} label="Total" value={summary.total} />
        <CandidateMetric icon={UserRoundSearch} label="Screening" value={summary.screening} />
        <CandidateMetric icon={BriefcaseBusiness} label="Interviews" value={summary.interviews} />
        <CandidateMetric icon={CheckCircle2} label="Hired" value={summary.hired} />
      </div>

      <div className="candidate-panel">
        <div className="candidate-panel__toolbar">
          <div>
            <h3>Candidate records</h3>
            <span>
              {candidates.length} people across {jobs.length} roles
            </span>
          </div>
          <label className="jobs-search candidate-search">
            <Search size={15} />
            <input
              aria-label="Search candidates"
              placeholder="Search candidates"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
        </div>

        {error && <div className="workspace-error">{error}</div>}
        {loading ? (
          <div className="workspace-state">
            <LoaderCircle className="workspace-spin" size={23} /> Loading candidates…
          </div>
        ) : filteredCandidates.length === 0 ? (
          <div className="candidate-empty">
            <span>
              <UserRoundSearch size={24} />
            </span>
            <h3>{candidates.length === 0 ? "No candidates yet" : "No matching candidates"}</h3>
            <p>
              {candidates.length === 0
                ? "Add a candidate and their resume to begin your talent pipeline."
                : "Try searching by name, email, role, or skill."}
            </p>
          </div>
        ) : (
          <div className="candidate-list">
            {filteredCandidates.map((candidate) => (
              <CandidateRow
                key={candidate.id}
                candidate={candidate}
                match={matches[candidate.id]}
                saving={savingId === candidate.id}
                onAnalyze={() => void analyzeCandidate(candidate)}
                onStatusChange={(status) => void updateStatus(candidate, status)}
              />
            ))}
          </div>
        )}
      </div>

      {editorOpen && (
        <CandidateEditor
          accessToken={accessToken}
          jobs={jobs}
          onClose={() => setEditorOpen(false)}
          onSaved={async () => {
            setEditorOpen(false);
            await Promise.all([loadCandidates(), onCandidateChanged()]);
          }}
        />
      )}
    </section>
  );
}

function CandidateMetric({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Users;
  label: string;
  value: number;
}) {
  return (
    <article>
      <span>
        <Icon size={15} />
      </span>
      <strong>{value}</strong>
      <small>{label}</small>
    </article>
  );
}

function CandidateRow({
  candidate,
  match,
  onAnalyze,
  onStatusChange,
  saving,
}: {
  candidate: Candidate;
  match?: CandidateMatch;
  onAnalyze(): void;
  onStatusChange(status: CandidateStatus): void;
  saving: boolean;
}) {
  return (
    <article className="candidate-row">
      <div className="candidate-avatar">{initials(candidate.name)}</div>
      <div className="candidate-row__identity">
        <div>
          <h3>{candidate.name}</h3>
          <span className={`candidate-status candidate-status--${candidate.status.toLowerCase()}`}>
            {statusLabels[candidate.status]}
          </span>
        </div>
        <p>
          {candidate.currentTitle} · {candidate.yearsExperience} years
        </p>
        <small>{candidate.email}</small>
      </div>
      <div className="candidate-row__role">
        <strong>{candidate.jobTitle}</strong>
        <span>
          <MapPin size={12} /> {candidate.location}
        </span>
        <div>
          {candidate.skills.slice(0, 3).map((skill) => (
            <i key={skill}>{skill}</i>
          ))}
        </div>
      </div>
      <div className="candidate-row__resume" title={candidate.resume.preview}>
        <FileText size={15} />
        <span>
          <strong>{candidate.resume.fileName}</strong>
          <small>
            {candidate.resume.extractedCharacters.toLocaleString()} characters extracted
          </small>
        </span>
      </div>
      <div className="candidate-row__match">
        {match ? (
          <>
            <span className={`match-score match-score--${match.recommendation.toLowerCase()}`}>
              {match.score}
            </span>
            <div title={match.rationale}>
              <strong>{match.recommendation.replaceAll("_", " ")}</strong>
              <small>{match.source === "GEMINI" ? match.model : "Explainable fallback"}</small>
            </div>
            <button
              aria-label={`Reanalyze ${candidate.name}`}
              disabled={saving}
              onClick={onAnalyze}
            >
              <BrainCircuit size={14} />
            </button>
          </>
        ) : (
          <button className="candidate-analyze" disabled={saving} onClick={onAnalyze}>
            {saving ? (
              <LoaderCircle className="workspace-spin" size={14} />
            ) : (
              <BrainCircuit size={14} />
            )}
            Analyze match
          </button>
        )}
      </div>
      <div className="candidate-row__stage">
        {saving && <LoaderCircle className="workspace-spin" size={14} />}
        <select
          aria-label={`Status for ${candidate.name}`}
          disabled={saving}
          value={candidate.status}
          onChange={(event) => onStatusChange(event.target.value as CandidateStatus)}
        >
          {Object.entries(statusLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
    </article>
  );
}

function CandidateEditor({
  accessToken,
  jobs,
  onClose,
  onSaved,
}: {
  accessToken: string;
  jobs: Job[];
  onClose(): void;
  onSaved(): Promise<void>;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    const values = new FormData(event.currentTarget);
    const resume = values.get("resume");
    if (!(resume instanceof File) || resume.size === 0) {
      setError("Attach a PDF or plain-text resume");
      setSubmitting(false);
      return;
    }

    const input: CreateCandidateRequest = {
      jobId: String(values.get("jobId")),
      name: String(values.get("name")),
      email: String(values.get("email")),
      phone: String(values.get("phone")),
      location: String(values.get("location")),
      currentTitle: String(values.get("currentTitle")),
      yearsExperience: Number(values.get("yearsExperience")),
      skills: String(values.get("skills"))
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean),
    };
    const body = new FormData();
    body.set("payload", JSON.stringify(input));
    body.set("resume", resume);

    try {
      await apiRequest<CandidateResponse>("/candidates", {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}` },
        body,
      });
      await onSaved();
    } catch (requestError) {
      setError(
        requestError instanceof ApiRequestError
          ? requestError.message
          : "Could not add the candidate",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="candidate-editor">
      <button
        aria-label="Close candidate editor"
        className="candidate-editor__backdrop"
        onClick={onClose}
      />
      <section role="dialog" aria-modal="true" aria-labelledby="candidate-editor-title">
        <header>
          <div>
            <span>Resume ingestion</span>
            <h2 id="candidate-editor-title">Add candidate</h2>
          </div>
          <button aria-label="Close" onClick={onClose}>
            <X size={18} />
          </button>
        </header>
        <form onSubmit={submit}>
          <div className="candidate-form__grid">
            <CandidateField label="Full name" name="name" />
            <CandidateField label="Email" name="email" type="email" />
            <CandidateField label="Phone" name="phone" />
            <CandidateField label="Location" name="location" />
            <CandidateField label="Current title" name="currentTitle" />
            <CandidateField label="Years of experience" name="yearsExperience" type="number" />
          </div>
          <label className="candidate-field">
            <span>Assign to job</span>
            <select name="jobId" required defaultValue="">
              <option value="" disabled>
                Select an open role
              </option>
              {jobs.map((job) => (
                <option key={job.id} value={job.id}>
                  {job.title} · {job.location}
                </option>
              ))}
            </select>
          </label>
          <CandidateField
            label="Skills (comma separated)"
            name="skills"
            placeholder="Python, LLMs, RAG"
          />
          <label className="candidate-upload">
            <input
              required
              accept=".pdf,.txt,application/pdf,text/plain"
              name="resume"
              type="file"
              onChange={(event) => setFileName(event.target.files?.[0]?.name ?? null)}
            />
            <span className="candidate-upload__icon">
              {fileName ? <CheckCircle2 size={21} /> : <UploadCloud size={21} />}
            </span>
            <strong>{fileName ?? "Upload candidate resume"}</strong>
            <small>PDF or TXT · maximum 2 MB · original file is not retained</small>
          </label>
          <div className="candidate-security-note">
            <ShieldCheck size={15} />
            Only extracted text and file metadata are stored for matching and auditability.
          </div>
          {error && <div className="workspace-error">{error}</div>}
          <footer>
            <button type="button" className="workspace-secondary" onClick={onClose}>
              Cancel
            </button>
            <button className="workspace-primary" disabled={submitting}>
              {submitting && <LoaderCircle className="workspace-spin" size={16} />}
              {submitting ? "Processing resume…" : "Add candidate"}
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}

function CandidateField({
  label,
  name,
  placeholder,
  type = "text",
}: {
  label: string;
  name: string;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="candidate-field">
      <span>{label}</span>
      <input
        required
        min={type === "number" ? 0 : undefined}
        max={type === "number" ? 60 : undefined}
        name={name}
        placeholder={placeholder}
        type={type}
      />
    </label>
  );
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}
