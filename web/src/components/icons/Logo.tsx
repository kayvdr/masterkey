import { Glyph } from "../../types";

const SvgLogo: Glyph = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" {...props}>
    <circle cx="25" cy="25" r="25" fill="url(#az)" />
    <path
      d="m23 25 26.46-5.18.18.93.13.84.12.96.08 1.16.03 1.33-.03 1.25-.06.98-.09.8-.15 1.06-.2 1.03z"
      fill="#D9D9D9"
    />
    <path
      d="M27 25 .53 30.15l-.17-.8-.14-.96-.12-1-.07-1.18-.04-1.26.06-1.5.07-.97.11-.97.16-.96.15-.74Z"
      fill="#D9D9D9"
    />
    <circle cx="25" cy="25" r="8" fill="#D9D9D9" />
    <defs>
      <linearGradient
        id="az"
        x1="-2"
        y1="1.5"
        x2="59.5"
        y2="51"
        gradientUnits="userSpaceOnUse"
      >
        <stop stop-color="#429E51" />
        <stop offset="1" stop-color="#4B5E4E" />
      </linearGradient>
    </defs>
  </svg>
);

export default SvgLogo;
