import Container from "../Container";
import Footer from "../Footer";
import Header from "../Header";
import styles from "./ImprintPage.module.css";

const ImprintPage = () => (
  <>
    <Header />
    <section className={styles.wrapper}>
      <Container>
        <h1 className={styles.title}>Imprint</h1>
        <h2 className={styles.subtitle}>Provider Information</h2>
        <p>Kay Vieider</p>
        {/* TODO: Add Address */}
        <p>[Street Address]</p>
        <p>[Postal Code, City]</p>
        <p>[Country]</p>
        <h2 className={styles.subtitle}>Contact</h2>
        <ul>
          {/* TODO: Add Contact data */}
          <li>Phone: [Your Phone Number]</li>
          <li>Email: [Your Email Address]</li>
          <li>
            Website:{" "}
            <a
              href="https://www.kayvdr.com"
              className={styles.link}
              target="_blank"
            >
              www.kayvdr.com
            </a>
          </li>
        </ul>
        <h2 className={styles.subtitle}>
          Responsible for Content According to § 55 Abs. 2 RStV
        </h2>
        <p>Kay Vieider</p>
        {/* TODO: Add Address */}
        <p>[Street Address]</p>
        <p>[Postal Code, City]</p>
        <p>[Country]</p>
        <h2 className={styles.subtitle}>
          EU Online Dispute Resolution Platform
        </h2>
        <p>
          The European Commission provides a platform for online dispute
          resolution (ODR):{" "}
          <a href="https://ec.europa.eu/consumers/odr/" target="_blank">
            https://ec.europa.eu/consumers/odr/
          </a>
        </p>
        <p>
          We are neither obligated nor willing to participate in dispute
          resolution proceedings before a consumer arbitration board.
        </p>
        <h2 className={styles.subtitle}>Liability for Content</h2>
        <p>
          As a service provider, we are responsible for our content on this
          website according to § 7 Abs.1 TMG. However, according to §§ 8 to 10
          TMG, we are not obligated to monitor transmitted or stored third-party
          information or to investigate circumstances indicating illegal
          activity.
        </p>
        <p>
          Obligations to remove or block the use of information under general
          laws remain unaffected. However, liability in this regard is only
          possible from the time of knowledge of a specific legal violation.
          Upon notification of such violations, we will remove this content
          immediately.
        </p>
        <h2 className={styles.subtitle}>Liability for Links</h2>
        <p>
          Our website contains links to external websites. We have no influence
          over the content of these external sites and therefore cannot assume
          any liability for them. The respective provider or operator is always
          responsible for the content of linked pages. The linked pages were
          checked for possible legal violations at the time of linking. Illegal
          content was not identifiable at the time of linking.
        </p>
        <p>
          Continuous monitoring of the content of linked pages is not reasonable
          without concrete evidence of a legal violation. Upon notification of
          violations, we will remove such links immediately.
        </p>
        <h2 className={styles.subtitle}>Copyright Notice</h2>
        <p>
          The content and works on this site created by the operator are subject
          to copyright laws. Duplication, editing, distribution, or any kind of
          exploitation outside the limits of copyright require written consent
          from the respective author or creator. Downloads and copies of this
          site are only permitted for private, non-commercial use.
        </p>
        <p>
          Insofar as content on this site was not created by the operator,
          third-party copyrights are respected. In particular, third-party
          content is marked as such. Should you become aware of a copyright
          infringement, please notify us. Upon notification of violations, we
          will remove such content immediately.
        </p>
      </Container>
    </section>
    <Footer />
  </>
);

export default ImprintPage;
