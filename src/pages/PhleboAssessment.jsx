import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getAssessmentByToken, submitAssessmentByToken } from '../services/phleboService.js';
import './phlebo-hire.css';
import './phlebo-assessment.css';

export default function PhleboAssessment() {
  const { token } = useParams();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [assessment, setAssessment] = useState(null);
  const [paper, setPaper] = useState(null);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = confirmOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [confirmOpen]);

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError('');
    try {
      const data = await getAssessmentByToken(token);
      setAssessment(data.assessment);
      setAlreadySubmitted(Boolean(data.alreadySubmitted));
      setPaper(data.paper || null);
      if (data.alreadySubmitted && data.assessment) {
        setResult({
          score: data.assessment.score,
          maxScore: data.assessment.maxScore,
          passMark: data.assessment.passMark,
          passed: data.assessment.status === 'passed' || data.assessment.canPromote,
          band: data.assessment.band,
        });
      }
    } catch (e) {
      const code = e?.response?.data?.error?.code;
      const msg = e?.response?.data?.error?.message || e.message;
      if (e?.response?.status === 410 || code === 'EXPIRED') {
        setError(msg || 'Assessment deadline has passed.');
        setAssessment(e?.response?.data?.data?.assessment || null);
      } else {
        setError(msg || 'Could not load assessment');
      }
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    load();
  }, [load]);

  const questions = paper?.questions || [];
  const answered = useMemo(
    () => questions.filter((q) => answers[String(q.id)]).length,
    [questions, answers],
  );

  const setAnswer = (id, letter) => {
    setAnswers((prev) => ({ ...prev, [String(id)]: letter }));
  };

  const firstUnansweredId = useMemo(() => {
    const q = questions.find((item) => !answers[String(item.id)]);
    return q?.id ?? null;
  }, [questions, answers]);

  const scrollToUnanswered = () => {
    if (firstUnansweredId == null) return;
    const el = document.getElementById(`assess-q-${firstUnansweredId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.classList.add('needs-answer');
      window.setTimeout(() => el.classList.remove('needs-answer'), 2200);
    }
  };

  const tryOpenConfirm = () => {
    if (answered < questions.length) {
      setError(`Please answer all ${questions.length} questions (${answered} done).`);
      scrollToUnanswered();
      return;
    }
    setError('');
    setConfirmOpen(true);
  };

  const onSubmit = async () => {
    if (answered < questions.length) {
      setError(`Please answer all ${questions.length} questions (${answered} done).`);
      setConfirmOpen(false);
      scrollToUnanswered();
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const data = await submitAssessmentByToken(token, answers);
      setAssessment(data.assessment);
      setResult(data.result);
      setAlreadySubmitted(true);
      setPaper(null);
      setConfirmOpen(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e) {
      setError(e?.response?.data?.error?.message || e.message || 'Submit failed');
      setConfirmOpen(false);
    } finally {
      setSubmitting(false);
    }
  };

  const pct = questions.length ? Math.round((answered / questions.length) * 100) : 0;

  if (loading) {
    return (
      <div className="ph-hire-page ph-assess-page">
        <div className="ph-hire-card">
          <p className="muted">Loading assessment…</p>
        </div>
      </div>
    );
  }

  if (result || alreadySubmitted) {
    return (
      <div className="ph-hire-page ph-assess-page">
        <div className="ph-hire-card ph-assess-result">
          <div className="ph-hire-emoji" aria-hidden>
            ✅
          </div>
          <h1>Assessment submitted</h1>
          <p>
            Thank you. Your answers have been recorded. Our hiring team will review your application
            and contact you for further steps.
          </p>
          <p className="muted">
            You do not need to do anything else right now. For questions, call support or wait for
            our team to reach out on your registered phone or email.
          </p>
          <div className="ph-hire-actions">
            <Link to="/" className="btn btn-primary">
              Phlebo home
            </Link>
            <Link to="/phlebo/login" className="btn btn-outline-dark">
              Field login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (error && !paper) {
    return (
      <div className="ph-hire-page ph-assess-page">
        <div className="ph-hire-card">
          <h1>Assessment unavailable</h1>
          <p className="ph-hire-error">{error}</p>
          <Link to="/onboarding-phlebotomist" className="btn btn-primary">
            Back to hire form
          </Link>
        </div>
      </div>
    );
  }

  const deadline = assessment?.deadlineAt
    ? new Date(assessment.deadlineAt).toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      })
    : null;

  // Group by section
  const sections = [];
  for (const q of questions) {
    let sec = sections.find((s) => s.section === q.section);
    if (!sec) {
      sec = { section: q.section, title: q.sectionTitle, items: [] };
      sections.push(sec);
    }
    sec.items.push(q);
  }

  return (
    <div className="ph-hire-page ph-assess-page">
      <div className="ph-hire-hero">
        <p className="ph-hire-eyebrow">Jeevan HealthCare · Level 1</p>
        <h1>Phlebotomist competency assessment</h1>
        <p>
          Home sample collection · {paper?.totalQuestions || 50} multiple-choice questions · one
          attempt
        </p>
        {deadline && (
          <p className="ph-assess-deadline">
            Complete by <strong>{deadline}</strong>
          </p>
        )}
      </div>

      <div className="ph-assess-progress" role="status" aria-live="polite">
        <div className="ph-assess-progress-row">
          <span>
            Answered <strong>{answered}</strong> / {questions.length}
          </span>
          <span className="ph-assess-progress-pct">{pct}%</span>
        </div>
        <div className="ph-assess-bar" aria-hidden>
          <span style={{ width: `${pct}%` }} />
        </div>
      </div>

      {error && <div className="ph-hire-error ph-assess-error">{error}</div>}

      <form
        className="ph-assess-form"
        onSubmit={(e) => {
          e.preventDefault();
          tryOpenConfirm();
        }}
      >
        {sections.map((sec) => (
          <section key={sec.section} className="ph-hire-card ph-assess-section">
            <h2>
              Section {sec.section}: {sec.title}
            </h2>
            {sec.items.map((q) => (
              <fieldset key={q.id} id={`assess-q-${q.id}`} className="ph-assess-q">
                <legend>
                  <span className="ph-assess-num">{q.id}.</span> {q.prompt}
                </legend>
                <div className="ph-assess-options" role="radiogroup" aria-label={`Question ${q.id}`}>
                  {(['A', 'B', 'C', 'D']).map((letter) => (
                    <label key={letter} className={answers[String(q.id)] === letter ? 'picked' : ''}>
                      <input
                        type="radio"
                        name={`q-${q.id}`}
                        value={letter}
                        checked={answers[String(q.id)] === letter}
                        onChange={() => setAnswer(q.id, letter)}
                      />
                      <span className="ph-assess-letter" aria-hidden>
                        {letter}
                      </span>
                      <span className="ph-assess-opt-text">{q.options[letter]}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            ))}
          </section>
        ))}

        {/* Spacer so last questions aren't hidden under fixed dock */}
        <div className="ph-assess-submit-bar" aria-hidden={false}>
          <div className="ph-assess-submit-inner">
            <p className="muted">
              {answered < questions.length
                ? `${questions.length - answered} left · tap option to answer`
                : 'All done — submit when ready'}
            </p>
            {answered < questions.length ? (
              <div className="ph-assess-submit-actions">
                <button type="button" className="btn btn-outline-dark" onClick={scrollToUnanswered}>
                  Next unanswered
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  Submit
                </button>
              </div>
            ) : (
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Submitting…' : 'Submit assessment'}
              </button>
            )}
          </div>
        </div>
      </form>

      {confirmOpen && (
        <div className="ph-assess-modal" role="dialog" aria-modal="true" aria-labelledby="assess-confirm-title">
          <button type="button" className="ph-assess-modal-bg" aria-label="Cancel" onClick={() => setConfirmOpen(false)} />
          <div className="ph-assess-modal-card">
            <h2 id="assess-confirm-title">Submit assessment?</h2>
            <p>
              You answered <strong>{answered}</strong> of <strong>{questions.length}</strong> questions.
              You cannot change answers after submit.
            </p>
            <div className="ph-hire-actions">
              <button type="button" className="btn btn-outline-dark" onClick={() => setConfirmOpen(false)}>
                Review
              </button>
              <button type="button" className="btn btn-primary" disabled={submitting} onClick={onSubmit}>
                {submitting ? 'Submitting…' : 'Confirm submit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
