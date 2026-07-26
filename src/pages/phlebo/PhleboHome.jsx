import { Link, Navigate } from 'react-router-dom';
import useAuthStore from '../../stores/authStore.js';
import { isPhleboRole, isAdminRole } from '../../utils/authRoles.js';
import InstallAppButton from '../../components/InstallAppButton.jsx';
import './phlebo-home.css';

/**
 * Landing for phlebo.jeevanhealthcare.com
 * Primary action: Field login. Secondary: job application.
 */
export default function PhleboHome() {
  const { user, isAuthenticated } = useAuthStore();

  if (isAuthenticated() && (isPhleboRole(user?.role) || isAdminRole(user?.role))) {
    return <Navigate to="/phlebo" replace />;
  }

  return (
    <div className="ph-home">
      <header className="ph-home-top">
        <div className="ph-home-top-inner">
          <div className="ph-home-brand">
            <img src="/logo.png" alt="Jeevan HealthCare" />
            <span>Phlebo</span>
          </div>
          <Link to="/phlebo/login" className="btn btn-primary ph-home-top-login">
            Field login
          </Link>
        </div>
      </header>

      <main className="ph-home-main">
        <section className="ph-home-hero">
          <p className="ph-home-eyebrow">Jeevan HealthCare · Field portal</p>
          <h1>Home collection &amp; camps</h1>
          <p className="ph-home-lead">
            Hired phlebotomists sign in with phone OTP to start duty, open jobs, and update sample
            status. Applicants use the hire form — not the field login.
          </p>

          <div className="ph-home-cta">
            <Link to="/phlebo/login" className="btn btn-primary btn-lg">
              Field login
            </Link>
            <Link to="/onboarding-phlebotomist" className="btn btn-outline-light btn-lg">
              Apply to join
            </Link>
          </div>

          <ul className="ph-home-steps" aria-label="How field login works">
            <li>
              <strong>1 · Hired by admin</strong>
              <span>Your application is promoted and phone login is enabled</span>
            </li>
            <li>
              <strong>2 · Sign in here</strong>
              <span>Use the same mobile number · OTP on this device (SMS later)</span>
            </li>
            <li>
              <strong>3 · Run the day</strong>
              <span>Start duty · accept jobs · collect · finish</span>
            </li>
          </ul>
        </section>

        <section className="ph-home-cards">
          <article className="ph-home-card">
            <h2>Already on the roster?</h2>
            <p>Go straight to field sign-in. You need a promoted phlebotomist account.</p>
            <Link to="/phlebo/login" className="btn btn-primary">
              Open field login
            </Link>
          </article>
          <article className="ph-home-card muted">
            <h2>New applicant?</h2>
            <p>Submit the hiring form. Admin reviews and enables your phone for this portal.</p>
            <Link to="/onboarding-phlebotomist" className="btn btn-outline-dark">
              Open hire form
            </Link>
          </article>
        </section>

        <div className="ph-home-install">
          <InstallAppButton variant="block" />
        </div>
      </main>

      <footer className="ph-home-foot">
        <span>phlebo.jeevanhealthcare.com</span>
        <a href="https://jeevanhealthcare.com">Patient site</a>
      </footer>
    </div>
  );
}
