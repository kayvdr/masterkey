import { Glyph } from "../../types";

const SvgFacebook: Glyph = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 68 68" {...props}>
    <g clipPath="url(#n)">
      <path
        d="M28.5 66.5A33.4 33.4 0 0 1 34 .2a33.4 33.4 0 0 1 5.5 66.3L37.7 65h-7.4l-1.8 1.5Z"
        fill="url(#m)"
      />
      <path
        d="m47 42.8 1.5-9.3h-8.8V27c0-2.7 1-4.7 5-4.7H49v-8.5c-2.3-.3-5-.6-7.3-.6-7.7 0-13 4.6-13 13v7.3h-8.4v9.3h8.4v23.5a30.7 30.7 0 0 0 11 0V42.8H47Z"
        fill="#fff"
      />
    </g>
    <defs>
      <linearGradient
        id="m"
        x1="34"
        y1="64.5"
        x2="34"
        y2=".2"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#0062E0" />
        <stop offset="1" stopColor="#19AFFF" />
      </linearGradient>
      <clipPath id="n">
        <path fill="#fff" d="M.7.2h66.7v66.7H.7z" />
      </clipPath>
    </defs>
  </svg>
);

export default SvgFacebook;
