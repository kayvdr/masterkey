import Container from "../Container";
import Footer from "../Footer";
import Header from "../Header";
import styles from "./PrivacyPage.module.css";

const PrivacyPage = () => (
  <>
    <Header />
    <section className={styles.wrapper}>
      <Container>
        <h1 className={styles.title}>Privacy Policy</h1>
        <h2 className={styles.subtitle}>1. Introduction</h2>
        <p>
          We value your privacy and are committed to protecting your personal
          information. This Privacy Policy outlines how we collect, use, and
          safeguard your data when you use our platform. It also explains your
          rights under the General Data Protection Regulation (GDPR).
        </p>
        <p>
          Our platform enables users to store login credentials for accounts on
          various platforms and securely share them with others as required.
        </p>
        <h2 className={styles.subtitle}>2. Data We Collect and Why</h2>
        <p>
          We collect the following categories of data to provide and improve our
          services:
        </p>
        <h3>2.1 Account Information</h3>
        <ul>
          <li>
            <strong>Platform Name:</strong> The platform for which the
            credentials are stored.
          </li>
          <li>
            <strong>Username and Password:</strong> Stored credentials for
            sharing. While passwords are not encrypted due to functional
            requirements, we implement strong safeguards to protect your data.
          </li>
        </ul>
        <h3>2.2 Authentication Data</h3>
        <p>
          We use Supabase Auth to manage user authentication and sessions. This
          includes:
        </p>
        <ul>
          <li>Login credentials (email and password).</li>
          <li>Session cookies to maintain your login status.</li>
        </ul>
        <h3>2.3 Analytics Data</h3>
        <p>
          To monitor and improve the platform’s performance, we use Google
          Analytics. This involves collecting anonymous data such as:
        </p>
        <ul>
          <li>Pages visited on our site.</li>
          <li>Time spent on each page.</li>
          <li>Browser, device, and operating system information.</li>
        </ul>
        <p>
          Google Analytics operates under strict privacy guidelines, and no
          personally identifiable information is collected. For more details,
          visit Google’s Privacy Policy.
        </p>
        <h2 className={styles.subtitle}>3. How We Use Your Data</h2>
        <p>We use your data strictly for the following purposes:</p>
        <ol>
          <li>
            <strong>Account Management:</strong> To provide access to the
            platform and allow sharing of login credentials.
          </li>
          <li>
            <strong>Platform Improvement:</strong> To analyze user behavior
            through Google Analytics and enhance the user experience.
          </li>
          <li>
            <strong>Authentication:</strong> To maintain secure login sessions
            using Supabase Auth.
          </li>
        </ol>
        <h3>4. Where Your Data is Stored</h3>
        <p>
          We host our platform on Google Cloud, with databases located within
          the European Union to comply with GDPR regulations.
        </p>
        <h2 className={styles.subtitle}>
          5. Cookies and Tracking Technologies
        </h2>
        <p>
          Our platform uses cookies to provide essential services and collect
          analytics data.
        </p>
        <h3>5.1 Essential Cookies</h3>
        <p>
          These cookies are necessary for the proper functioning of the platform
          and include:
        </p>
        <ul>
          <li>
            <strong>Supabase Auth Cookies:</strong> Manage authentication and
            maintain user sessions.
          </li>
        </ul>
        <p>These cookies are required and cannot be disabled.</p>
        <h3>5.2 Analytics Cookies</h3>
        <p>
          Google Analytics cookies track anonymized user behavior to improve the
          platform. These cookies are only activated with your consent.
        </p>
        <p>
          You can opt out of analytics cookies at any time through the cookie
          management settings on our platform.
        </p>
        <h2 className={styles.subtitle}>6. Sharing Your Data</h2>
        <p>We do not share your personal data with third parties except for:</p>
        <ol>
          <li>
            <strong>Supabase:</strong> For user authentication and backend
            services.
          </li>
          <li>
            <strong>Google Analytics:</strong> To collect anonymized analytics
            data.
          </li>
        </ol>
        <p>All third-party services comply with GDPR.</p>
        <h2 className={styles.subtitle}>7. Your Rights Under GDPR</h2>
        <p>You have the following rights regarding your personal data:</p>
        <ol>
          <li>Access: Request a copy of the data we store about you.</li>
          <li>
            Correction: Request corrections to inaccurate or incomplete data.
          </li>
          <li>Deletion: Request the deletion of your data where applicable.</li>
          <li>
            Objection: Object to the processing of your data for analytics.
          </li>
          <li>
            Consent Withdrawal: Withdraw consent for non-essential cookies, such
            as analytics cookies, at any time.
          </li>
        </ol>
        <h2 className={styles.subtitle}>8. Security Measures</h2>
        <p>
          We prioritize your data security and have implemented robust
          safeguards to prevent unauthorized access or misuse of your data.
          These measures include:
        </p>
        <ul>
          <li>Secure storage on Google Cloud.</li>
          <li>Limiting access to sensitive information.</li>
        </ul>
      </Container>
    </section>
    <Footer />
  </>
);

export default PrivacyPage;
