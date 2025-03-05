import { useEffect } from "react";
import * as CookieConsent from "vanilla-cookieconsent";
import "vanilla-cookieconsent/dist/cookieconsent.css";
import styles from "./CookieComponent.module.css";
import SvgCookie from "./icons/Cookie";
import Icon from "./ui/Icon";

const addGoogleAnalytics = () => {
  if (document.getElementById("ga-analytics-script")) return;

  const script = document.createElement("script");
  script.id = "ga-analytics-script";
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${
    import.meta.env.VITE_GA_TRACKING_ID
  }`;
  document.head.appendChild(script);

  script.onload = () => {
    window.dataLayer = window.dataLayer || [];
    const gtag = (...args: unknown[]) => {
      window.dataLayer.push(args);
    };
    gtag("js", new Date());
    gtag("config", import.meta.env.VITE_GA_TRACKING_ID);
  };
};

const removeGoogleAnalytics = () => {
  const script = document.getElementById("ga-analytics-script");
  if (script) script.remove();

  if (window.dataLayer) {
    window.dataLayer = [];
  }
};

const handleConsentChange = () => {
  const isAnalyticsAllowed = CookieConsent.acceptedCategory("analytics");
  isAnalyticsAllowed ? addGoogleAnalytics() : removeGoogleAnalytics();
};

const CookieComponent = () => {
  useEffect(() => {
    CookieConsent.run({
      guiOptions: {
        consentModal: {
          layout: "bar",
          position: "bottom center",
        },
      },
      categories: {
        analytics: {},
      },
      language: {
        default: "en",
        translations: {
          en: {
            consentModal: {
              title: "We use cookies",
              description:
                "Hello, this website uses essential cookies to ensure its proper functioning and tracking cookies to understand how you interact with it. The latter is only set after permission.",
              acceptAllBtn: "Accept all",
              acceptNecessaryBtn: "Reject all",
              showPreferencesBtn: "Manage Individual preferences",
            },
            preferencesModal: {
              title: "Manage cookie preferences",
              acceptAllBtn: "Accept all",
              acceptNecessaryBtn: "Reject all",
              savePreferencesBtn: "Accept current selection",
              closeIconLabel: "Close modal",
              sections: [
                {
                  title: "Cookie Usage",
                  description:
                    "We use cookies to ensure basic website functionality and to improve your online experience. You can choose to opt in or out of each category whenever you want.",
                },
                {
                  title: "Strictly Necessary cookies",
                  description:
                    "These cookies are essential for the proper functioning of the website and cannot be disabled.",
                  linkedCategory: "necessary",
                },
                {
                  title: "Analytics Cookies",
                  description:
                    "Analytical cookies are used to understand how visitors interact with the website. These cookies help provide information on metrics such as the number of visitors, bounce rate, traffic source, etc.",
                  linkedCategory: "analytics",
                  cookieTable: {
                    headers: {
                      name: "Name",
                      domain: "Service",
                      description: "Description",
                      expiration: "Expiration",
                    },
                    body: [
                      {
                        name: "_ga",
                        domain: "Google Analytics",
                        description:
                          'Cookie set by <a href="#das">Google Analytics</a>.',
                        expiration: "Expires after 12 days",
                      },
                    ],
                  },
                },
              ],
            },
          },
        },
      },
      onConsent: handleConsentChange,
      onChange: handleConsentChange,
    });
  }, []);

  return (
    <button
      type="button"
      className={styles.button}
      data-cc="show-preferencesModal"
    >
      <Icon glyph={SvgCookie} />
    </button>
  );
};

export default CookieComponent;
