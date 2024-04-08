import { Glyph } from "../types";

const SvgCheckbox: Glyph = (props) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
      <path d="m9.96 17.3 9.63-9.67-1.43-1.43-8.2 8.23L6 10.46 4.57 11.9l5.4 5.4zM0 24V0h24v24H0z" />
    </svg>
  );
};

export const SvgCheckboxIndeterminate: Glyph = (props) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
      <path d="M18.65 13.25V10.7H5.33v2.55h13.32zM0 24V0h24v24H0z" />
    </svg>
  );
};

export const SvgCheckboxOutlineBlank: Glyph = (props) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
      <path d="M0 24V0h24v24H0zm2-2h20V2H2v20z" />
    </svg>
  );
};

export default SvgCheckbox;
