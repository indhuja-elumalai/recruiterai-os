import { useCallback, useEffect, useState } from "react";
import {
  BarChart3,
  BriefcaseBusiness,
  BrainCircuit,
  CheckCircle2,
  LoaderCircle,
  RefreshCw,
  Star,
  Users,
} from "lucide-react";
import type { AnalyticsResponse } from "@recruiterai/contracts";
import { ApiRequestError, apiRequest } from "../lib/api";
import "./recruitment-analytics.css";

export function RecruitmentAnalytics({
  accessToken,
  refreshKey,
}: {
  accessToken: string;
  refreshKey: number;
}) {
  const [analytics, setAnalytics] = useState<AnalyticsResponse["data"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAnalytics = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiRequest<AnalyticsResponse>("/analytics/overview", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setAnalytics(response.data);
      setError(null);
    } catch (requestError) {
      setError(
        requestError instanceof ApiRequestError
          ? requestError.message
          : "Could not load recruitment analytics",
      );
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    void loadAnalytics();
  }, [loadAnalytics, refreshKey]);

  const maxFunnel = Math.max(1, ...(analytics?.funnel.map((item) => item.count) ?? [1]));
  const maxApplicants = Math.max(1, ...(analytics?.topJobs.map((item) => item.applicants) ?? [1]));

  return (
    <section className="analytics-section" id="recruitment-analytics">
      <div className="analytics-heading">
        <div>
          <span>Decision intelligence</span>
          <h2>Recruitment analytics</h2>
          <p>Monitor pipeline health, match coverage, and interview outcomes.</p>
        </div>
        <button
          className="workspace-secondary"
          disabled={loading}
          onClick={() => void loadAnalytics()}
        >
          <RefreshCw className={loading ? "workspace-spin" : ""} size={14} /> Refresh
        </button>
      </div>

      {error && <div className="workspace-error">{error}</div>}
      {!analytics || loading ? (
        <div className="analytics-loading">
          <LoaderCircle className="workspace-spin" size={23} /> Building analytics…
        </div>
      ) : (
        <>
          <div className="analytics-kpis">
            <Kpi
              icon={BriefcaseBusiness}
              label="Active roles"
              value={analytics.overview.activeJobs}
              detail={`${analytics.overview.totalJobs} total`}
            />
            <Kpi
              icon={Users}
              label="Candidates"
              value={analytics.overview.totalCandidates}
              detail={`${analytics.overview.hires} hired`}
            />
            <Kpi
              icon={BrainCircuit}
              label="Average match"
              value={`${analytics.overview.averageMatchScore}%`}
              detail={`${analytics.quality.analyzedCandidates} analyzed`}
            />
            <Kpi
              icon={CheckCircle2}
              label="Upcoming"
              value={analytics.overview.upcomingInterviews}
              detail="interviews"
            />
          </div>

          <div className="analytics-grid">
            <article className="analytics-card">
              <header>
                <div>
                  <BarChart3 size={15} />
                  <h3>Candidate funnel</h3>
                </div>
                <span>Current stage distribution</span>
              </header>
              <div className="funnel-chart">
                {analytics.funnel.map((item) => (
                  <div key={item.stage}>
                    <span>{item.stage.toLowerCase()}</span>
                    <i>
                      <b style={{ width: `${Math.max(3, (item.count / maxFunnel) * 100)}%` }} />
                    </i>
                    <strong>{item.count}</strong>
                  </div>
                ))}
              </div>
            </article>

            <article className="analytics-card">
              <header>
                <div>
                  <BriefcaseBusiness size={15} />
                  <h3>Job demand</h3>
                </div>
                <span>Applicants by role</span>
              </header>
              <div className="job-demand">
                {analytics.topJobs.length ? (
                  analytics.topJobs.map((job) => (
                    <div key={job.id}>
                      <span>{job.title}</span>
                      <i>
                        <b
                          style={{
                            width: `${Math.max(3, (job.applicants / maxApplicants) * 100)}%`,
                          }}
                        />
                      </i>
                      <strong>{job.applicants}</strong>
                    </div>
                  ))
                ) : (
                  <p>Create jobs and add candidates to populate this view.</p>
                )}
              </div>
            </article>

            <article className="analytics-card analytics-card--compact">
              <header>
                <div>
                  <BrainCircuit size={15} />
                  <h3>Match engine</h3>
                </div>
              </header>
              <dl>
                <div>
                  <dt>Strong matches</dt>
                  <dd>{analytics.quality.strongMatches}</dd>
                </div>
                <div>
                  <dt>Gemini analyses</dt>
                  <dd>{analytics.quality.geminiAnalyses}</dd>
                </div>
                <div>
                  <dt>Fallback analyses</dt>
                  <dd>{analytics.quality.fallbackAnalyses}</dd>
                </div>
              </dl>
            </article>

            <article className="analytics-card analytics-card--compact">
              <header>
                <div>
                  <Star size={15} />
                  <h3>Interview quality</h3>
                </div>
              </header>
              <dl>
                <div>
                  <dt>Completed</dt>
                  <dd>{analytics.interviews.completed}</dd>
                </div>
                <div>
                  <dt>Feedback submitted</dt>
                  <dd>{analytics.interviews.feedbackSubmitted}</dd>
                </div>
                <div>
                  <dt>Average rating</dt>
                  <dd>{analytics.interviews.averageRating}/5</dd>
                </div>
              </dl>
            </article>
          </div>
          <p className="analytics-generated">
            Updated {new Date(analytics.generatedAt).toLocaleString("en-IN")}
          </p>
        </>
      )}
    </section>
  );
}

function Kpi({
  icon: Icon,
  label,
  value,
  detail,
}: {
  icon: typeof Users;
  label: string;
  value: string | number;
  detail: string;
}) {
  return (
    <article>
      <span>
        <Icon size={16} />
      </span>
      <div>
        <small>{label}</small>
        <strong>{value}</strong>
        <em>{detail}</em>
      </div>
    </article>
  );
}
