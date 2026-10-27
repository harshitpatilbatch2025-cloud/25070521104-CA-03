import { Link } from 'react-router-dom';
import Logo from './Logo.jsx';
import { Icon } from './Icons.jsx';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="report-banner">
          <div className="report-icon">
            <Icon name="alert" size={22} />
          </div>
          <div>
            <strong>If you have lost money or been threatened, report it now.</strong>
            <p>
              In India, call the cybercrime helpline <a href="tel:1930">1930</a> or report at{' '}
              <a href="https://cybercrime.gov.in" target="_blank" rel="noreferrer noopener">
                cybercrime.gov.in
              </a>
              . Elsewhere, contact your local police and national cybercrime authority.
            </p>
          </div>
        </div>

        <div className="footer-grid">
          <div className="footer-brand">
            <Logo />
            <p>
              A free awareness portal that helps people recognize digital fraud, verify suspicious
              messages, and build safer online habits.
            </p>
            <div className="footer-badges">
              <span className="footer-badge">
                <Icon name="shield" size={14} /> Education first
              </span>
              <span className="footer-badge">
                <Icon name="lock" size={14} /> Privacy respected
              </span>
            </div>
          </div>

          <div className="footer-col">
            <h3>Explore</h3>
            <Link to="/scam-types">Scam types</Link>
            <Link to="/learn">Learning hub</Link>
            <Link to="/quizzes">Safety quizzes</Link>
            <Link to="/">Home</Link>
          </div>

          <div className="footer-col">
            <h3>Account</h3>
            <Link to="/register">Create account</Link>
            <Link to="/login">Log in</Link>
            <Link to="/dashboard">Your dashboard</Link>
            <a href="mailto:hello@scamshield.example">Contact us</a>
          </div>

          <div className="footer-col">
            <h3>Report &amp; recover</h3>
            <a href="https://cybercrime.gov.in" target="_blank" rel="noreferrer noopener">
              Cybercrime portal <Icon name="external" size={12} />
            </a>
            <a href="tel:1930">Helpline 1930</a>
            <a href="https://www.rbi.org.in" target="_blank" rel="noreferrer noopener">
              Banking regulator <Icon name="external" size={12} />
            </a>
            <Link to="/learn/otp-fraud-never-share-your-code">Fraud response guide</Link>
          </div>
        </div>

        <div className="footer-disclaimer">
          <p>
            <strong>Disclaimer:</strong> ScamShield is an independent educational project. It is not
            affiliated with any bank, payment provider, or government agency, and it cannot recover
            money or give legal advice. ScamShield will never call, email, or message you asking for
            an OTP, password, or payment. Always verify urgent requests through an official channel
            you find yourself.
          </p>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} ScamShield. Built for digital safety awareness.</span>
          <span className="footer-bottom-links">
            <Link to="/scam-types">Stay informed</Link>
            <span aria-hidden="true">·</span>
            <Link to="/quizzes">Test your knowledge</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
