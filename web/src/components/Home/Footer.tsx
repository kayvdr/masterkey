import styles from "../Home/Footer.module.css";
import SvgFacebookBlack from "../icons/FacebookBlack";
import SvgGithubBlack from "../icons/GithubBlack";
import SvgInstagramBlack from "../icons/InstagramBlack";

const Footer = () => (
  <footer className={styles.footer}>
    <div className="container">
      <div className={styles.wrapper}>
        <div className={styles.company}>
          <h3 className={styles.companyTitle}>Shac</h3>
          <p>
            Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
            nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam
            erat, sed diam voluptua.
          </p>
        </div>
        <div className={styles.social}>
          <h4 className={styles.title}>Social Media</h4>
          <ul className={styles.list}>
            <li className={styles.listItem}>
              <a href="" className={styles.listLink}>
                <SvgInstagramBlack className={styles.icon} />
                Instagram
              </a>
            </li>
            <li className={styles.listItem}>
              <a href="" className={styles.listLink}>
                <SvgFacebookBlack className={styles.icon} />
                Facebook
              </a>
            </li>
            <li className={styles.listItem}>
              <a href="" className={styles.listLink}>
                <SvgGithubBlack className={styles.icon} />
                Github
              </a>
            </li>
          </ul>
        </div>
        <div className={styles.links}>
          <h4 className={styles.title}>Links</h4>
          <ul className={styles.list}>
            <li className={styles.listItem}>
              <a href="" className={styles.listLink}>
                Impressum
              </a>
            </li>
            <li className={styles.listItem}>
              <a href="" className={styles.listLink}>
                Privacy
              </a>
            </li>
          </ul>
        </div>
        <div className={styles.contacts}>
          <h4 className={styles.title}>Contacts</h4>
          <ul className={styles.list}>
            <li className={styles.listItem}>61 Broadway</li>
            <li className={styles.listItem}>New York, NY 10006</li>
            <li className={styles.listItem}>
              <a href="tel:340 0000 000" className={styles.listLink}>
                340 0000 000
              </a>
            </li>
            <li className={styles.listItem}>
              <a href="mailto:on3k.dev@gmail.com" className={styles.listLink}>
                on3k.dev@gmail.com
              </a>
            </li>
          </ul>
        </div>
      </div>
      <p className={styles.copyright}>© 2022 Dribbble. All rights reserved.</p>
    </div>
  </footer>
);

export default Footer;
