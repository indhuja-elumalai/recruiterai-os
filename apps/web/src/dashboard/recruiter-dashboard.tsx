import { type FormEvent, useCallback, useEffect, useState } from "react";
import {
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  ChevronRight,
  CirclePause,
  FilePenLine,
  LayoutDashboard,
  LoaderCircle,
  LogOut,
  MapPin,
  Plus,
  Search,
  Sparkles,
  Users,
  X,
  Zap,
} from "lucide-react";
import type {
  CreateJobRequest,
  EmploymentType,
  Job,
  JobResponse,
  JobsResponse,
  JobStatus,
  WorkplaceType,
} from "@recruiterai/contracts";
import { useAuth } from "../auth/auth-context";
import { ApiRequestError, apiRequest } from "../lib/api";
import { CandidatePipeline } from "./candidate-pipeline";
import { InterviewOperations } from "./interview-operations";
import "./recruiter-dashboard.css";

const emptySummary = { total: 0, active: 0, drafts: 0, applicants: 0 };

const statusLabels: Record<JobStatus, string> = {
  DRAFT: "Draft",
  PUBLISHED: "Published",
  PAUSED: "Paused",
  CLOSED: "Closed",
};

const employmentLabels: Record<EmploymentType, string> = {
  FULL_TIME: "Full time",
  PART_TIME: "Part time",
  CONTRACT: "Contract",
  INTERNSHIP: "Internship",
};

const workplaceLabels: Record<WorkplaceType, string> = {
  REMOTE: "Remote",
  HYBRID: "Hybrid",
  ON_SITE: "On-site",
};

export function RecruiterDashboard() {
  const { accessToken, logout, user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [summary, setSummary] = useState(emptySummary);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [editorJob, setEditorJob] = useState<Job | null | undefined>(undefined);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [candidateVersion, setCandidateVersion] = useState(0);

  const authHeaders = useCallback(
    () => ({ Authorization: `Bearer ${accessToken}` }),
    [accessToken],
  );

  const loadJobs = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    setError(null);
    try {
      const response = await apiRequest<JobsResponse>("/jobs", { headers: authHeaders() });
      setJobs(response.data.jobs);
      setSummary(response.data.summary);
    } catch (requestError) {
      setError(
        requestError instanceof ApiRequestError
          ? requestError.message
          : "Could not load the hiring workspace",
      );
    } finally {
      setLoading(false);
    }
  }, [accessToken, authHeaders]);

  useEffect(() => {
    void loadJobs();
  }, [loadJobs]);

  const updateJob = async (job: Job, update: Partial<CreateJobRequest>) => {
    setSavingId(job.id);
    setError(null);
    try {
      const response = await apiRequest<JobResponse>(`/jobs/${job.id}`, {
        method: "PATCH",
        headers: authHeaders(),
        body: JSON.stringify(update),
      });
      setJobs((current) =>
        current.map((currentJob) =>
          currentJob.id === response.data.job.id ? response.data.job : currentJob,
        ),
      );
      await loadJobs();
    } catch (requestError) {
      setError(
        requestError instanceof ApiRequestError ? requestError.message : "Could not update the job",
      );
    } finally {
      setSavingId(null);
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const value = query.toLowerCase();
    return (
      job.title.toLowerCase().includes(value) ||
      job.department.toLowerCase().includes(value) ||
      job.location.toLowerCase().includes(value)
    );
  });

  if (!user) return null;

  return (
    <div className="workspace-shell">
      <aside className="workspace-sidebar">
        <div className="workspace-brand">
          <span className="workspace-brand__mark">
            <Zap size={18} fill="currentColor" />
          </span>
          <span>
            Recruiter<strong>AI</strong>
          </span>
        </div>
        <nav className="workspace-nav" aria-label="Workspace navigation">
          <button className="workspace-nav__item workspace-nav__item--active">
            <LayoutDashboard size={17} /> Overview
          </button>
          <button className="workspace-nav__item">
            <BriefcaseBusiness size={17} /> Jobs <span>{summary.total}</span>
          </button>
          <button
            className="workspace-nav__item"
            onClick={() =>
              document.querySelector("#candidate-pipeline")?.scrollIntoView({ behavior: "smooth" })
            }
          >
            <Users size={17} /> Candidates
          </button>
          <button className="workspace-nav__item">
            <Sparkles size={17} /> AI matching
          </button>
        </nav>
        <div className="workspace-sidebar__footer">
          <div className="workspace-user__avatar">{initials(user.name)}</div>
          <div className="workspace-user__identity">
            <strong>{user.name}</strong>
            <span>{user.organizationName}</span>
          </div>
          <button aria-label="Log out" title="Log out" onClick={() => void logout()}>
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      <main className="workspace-main">
        <header className="workspace-topbar">
          <div>
            <span className="workspace-topbar__eyebrow">Recruitment workspace</span>
            <h1>Hiring overview</h1>
          </div>
          <button className="workspace-primary" onClick={() => setEditorJob(null)}>
            <Plus size={17} /> Create job
          </button>
        </header>

        <section className="workspace-welcome">
          <div>
            <span className="workspace-welcome__badge">
              <Sparkles size={13} /> Workspace ready
            </span>
            <h2>Good to see you, {user.name.split(" ")[0]}.</h2>
            <p>Create a role and begin building your AI-assisted hiring pipeline.</p>
          </div>
          <div className="workspace-welcome__signal" aria-hidden="true">
            <span>AI</span>
            <i />
            <i />
            <i />
          </div>
        </section>

        <section className="workspace-stats" aria-label="Hiring summary">
          <Metric icon={BriefcaseBusiness} label="Total jobs" value={summary.total} tone="blue" />
          <Metric icon={Zap} label="Published" value={summary.active} tone="green" />
          <Metric icon={FilePenLine} label="Drafts" value={summary.drafts} tone="amber" />
          <Metric icon={Users} label="Applicants" value={summary.applicants} tone="purple" />
        </section>

        <section className="jobs-panel">
          <div className="jobs-panel__header">
            <div>
              <h2>Open roles</h2>
              <p>Manage job details and publishing status.</p>
            </div>
            <label className="jobs-search">
              <Search size={15} />
              <input
                aria-label="Search jobs"
                placeholder="Search roles"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </label>
          </div>

          {error && <div className="workspace-error">{error}</div>}
          {loading ? (
            <div className="workspace-state">
              <LoaderCircle className="workspace-spin" size={24} /> Loading jobs…
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="workspace-empty">
              <span>
                <BriefcaseBusiness size={24} />
              </span>
              <h3>{jobs.length === 0 ? "Create your first role" : "No matching roles"}</h3>
              <p>
                {jobs.length === 0
                  ? "Your job pipeline and applicant analytics will appear here."
                  : "Try another title, department, or location."}
              </p>
              {jobs.length === 0 && (
                <button className="workspace-secondary" onClick={() => setEditorJob(null)}>
                  <Plus size={16} /> New job
                </button>
              )}
            </div>
          ) : (
            <div className="jobs-list">
              {filteredJobs.map((job) => (
                <JobRow
                  key={job.id}
                  job={job}
                  saving={savingId === job.id}
                  onEdit={() => setEditorJob(job)}
                  onStatusChange={(status) => void updateJob(job, { status })}
                />
              ))}
            </div>
          )}
        </section>

        <CandidatePipeline
          accessToken={accessToken!}
          jobs={jobs}
          onCandidateChanged={async () => {
            await loadJobs();
            setCandidateVersion((version) => version + 1);
          }}
        />
        <InterviewOperations accessToken={accessToken!} refreshKey={candidateVersion} />
      </main>

      {editorJob !== undefined && (
        <JobEditor
          accessToken={accessToken!}
          job={editorJob}
          onClose={() => setEditorJob(undefined)}
          onSaved={async () => {
            setEditorJob(undefined);
            await loadJobs();
          }}
        />
      )}
    </div>
  );
}

function Metric({
  icon: Icon,
  label,
  tone,
  value,
}: {
  icon: typeof BriefcaseBusiness;
  label: string;
  tone: string;
  value: number;
}) {
  return (
    <article className="workspace-metric">
      <span className={`workspace-metric__icon workspace-metric__icon--${tone}`}>
        <Icon size={17} />
      </span>
      <div>
        <strong>{value}</strong>
        <span>{label}</span>
      </div>
    </article>
  );
}

function JobRow({
  job,
  onEdit,
  onStatusChange,
  saving,
}: {
  job: Job;
  onEdit(): void;
  onStatusChange(status: JobStatus): void;
  saving: boolean;
}) {
  const nextStatus: JobStatus = job.status === "PUBLISHED" ? "PAUSED" : "PUBLISHED";
  return (
    <article className="job-row">
      <div className="job-row__mark">{job.title.slice(0, 2).toUpperCase()}</div>
      <div className="job-row__content">
        <div className="job-row__title-line">
          <h3>{job.title}</h3>
          <span className={`job-status job-status--${job.status.toLowerCase()}`}>
            {statusLabels[job.status]}
          </span>
        </div>
        <div className="job-row__meta">
          <span>
            <Building2 size={13} /> {job.department}
          </span>
          <span>
            <MapPin size={13} /> {job.location} · {workplaceLabels[job.workplaceType]}
          </span>
          <span>
            <CalendarDays size={13} /> {employmentLabels[job.employmentType]}
          </span>
        </div>
        <div className="job-row__skills">
          {job.skills.slice(0, 4).map((skill) => (
            <span key={skill}>{skill}</span>
          ))}
        </div>
      </div>
      <div className="job-row__actions">
        <button disabled={saving} onClick={() => onStatusChange(nextStatus)}>
          {saving ? (
            <LoaderCircle className="workspace-spin" size={15} />
          ) : (
            <CirclePause size={15} />
          )}
          {job.status === "PUBLISHED" ? "Pause" : "Publish"}
        </button>
        <button aria-label={`Edit ${job.title}`} className="job-row__edit" onClick={onEdit}>
          <FilePenLine size={16} />
        </button>
        <ChevronRight size={16} className="job-row__chevron" />
      </div>
    </article>
  );
}

function JobEditor({
  accessToken,
  job,
  onClose,
  onSaved,
}: {
  accessToken: string;
  job: Job | null;
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
    const salaryMin = String(values.get("salaryMin")).trim();
    const salaryMax = String(values.get("salaryMax")).trim();
    const input: CreateJobRequest = {
      title: String(values.get("title")),
      department: String(values.get("department")),
      location: String(values.get("location")),
      workplaceType: String(values.get("workplaceType")) as WorkplaceType,
      employmentType: String(values.get("employmentType")) as EmploymentType,
      description: String(values.get("description")),
      skills: String(values.get("skills"))
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean),
      salaryMin: salaryMin ? Number(salaryMin) : null,
      salaryMax: salaryMax ? Number(salaryMax) : null,
      currency: "INR",
      status: String(values.get("status")) as JobStatus,
    };

    try {
      await apiRequest<JobResponse>(job ? `/jobs/${job.id}` : "/jobs", {
        method: job ? "PATCH" : "POST",
        headers: { Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify(input),
      });
      await onSaved();
    } catch (requestError) {
      setError(
        requestError instanceof ApiRequestError ? requestError.message : "Could not save the job",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="job-editor" role="presentation">
      <button className="job-editor__backdrop" aria-label="Close job editor" onClick={onClose} />
      <section
        className="job-editor__card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="job-editor-title"
      >
        <header>
          <div>
            <span>{job ? "Update requisition" : "New requisition"}</span>
            <h2 id="job-editor-title">{job ? "Edit job" : "Create a job"}</h2>
          </div>
          <button aria-label="Close" onClick={onClose}>
            <X size={18} />
          </button>
        </header>
        <form onSubmit={submit}>
          <div className="job-form__grid">
            <JobField label="Job title" name="title" defaultValue={job?.title} />
            <JobField label="Department" name="department" defaultValue={job?.department} />
            <JobField label="Location" name="location" defaultValue={job?.location} />
            <label className="job-field">
              <span>Workplace</span>
              <select name="workplaceType" defaultValue={job?.workplaceType ?? "HYBRID"}>
                <option value="REMOTE">Remote</option>
                <option value="HYBRID">Hybrid</option>
                <option value="ON_SITE">On-site</option>
              </select>
            </label>
            <label className="job-field">
              <span>Employment</span>
              <select name="employmentType" defaultValue={job?.employmentType ?? "FULL_TIME"}>
                <option value="FULL_TIME">Full time</option>
                <option value="PART_TIME">Part time</option>
                <option value="CONTRACT">Contract</option>
                <option value="INTERNSHIP">Internship</option>
              </select>
            </label>
            <label className="job-field">
              <span>Status</span>
              <select name="status" defaultValue={job?.status ?? "DRAFT"}>
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
                <option value="PAUSED">Paused</option>
                <option value="CLOSED">Closed</option>
              </select>
            </label>
            <JobField
              label="Minimum salary (INR)"
              name="salaryMin"
              type="number"
              required={false}
              defaultValue={job?.salaryMin ?? ""}
            />
            <JobField
              label="Maximum salary (INR)"
              name="salaryMax"
              type="number"
              required={false}
              defaultValue={job?.salaryMax ?? ""}
            />
          </div>
          <JobField
            label="Skills (comma separated)"
            name="skills"
            defaultValue={job?.skills.join(", ")}
            placeholder="React, TypeScript, Node.js"
          />
          <label className="job-field">
            <span>Description</span>
            <textarea
              required
              minLength={30}
              name="description"
              rows={5}
              defaultValue={job?.description}
              placeholder="Describe the role, outcomes, and candidate profile…"
            />
          </label>
          {error && <div className="workspace-error">{error}</div>}
          <footer>
            <button type="button" className="workspace-secondary" onClick={onClose}>
              Cancel
            </button>
            <button className="workspace-primary" disabled={submitting}>
              {submitting && <LoaderCircle className="workspace-spin" size={16} />}
              {job ? "Save changes" : "Create job"}
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}

function JobField({
  defaultValue,
  label,
  name,
  placeholder,
  required = true,
  type = "text",
}: {
  defaultValue?: string | number;
  label: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  type?: string;
}) {
  return (
    <label className="job-field">
      <span>{label}</span>
      <input
        defaultValue={defaultValue}
        min={type === "number" ? 0 : undefined}
        name={name}
        placeholder={placeholder}
        required={required}
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
