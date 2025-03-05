import { Glyph } from "../../types";

const SvgTinder: Glyph = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 31 36" {...props}>
    <defs>
      <radialGradient
        id="a"
        cy="856.9"
        r="35.2"
        fx="173.8"
        fy="856.9"
        gradientTransform="matrix(.93267 0 0 1.0722 -146.5 -883.2)"
        cx="173.8"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0%" stopColor="#FF7854" />
        <stop offset="100%" stopColor="#FD267D" />
      </radialGradient>
    </defs>
    <path
      fill="url(#a)"
      fillRule="evenodd"
      d="M9.4 14.6a.1.1 0 0 1-.1 0 11.2 11.2 0 0 1-1.6-5.4c0-.2-.2-.3-.4-.2-3.7 2-7.1 7-7.1 11.7 0 8 5.6 15 15.4 15a15 15 0 0 0 15.3-15A23 23 0 0 0 16.9.3a.2.2 0 0 0-.3.3c.8 5.6-.3 11.6-7.2 14z"
    />
  </svg>
);

export default SvgTinder;
