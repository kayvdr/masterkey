import { Glyph } from "../types";

const SvgOpenInNew: Glyph = (props) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
      <path d="M2.67 24q-1.1 0-1.89-.78T0 21.34V2.67Q0 1.57.78.78T2.67 0H12v2.67H2.67v18.67h18.67V12H24v9.34q0 1.1-.79 1.88t-1.88.79H2.67zm6.27-7.06-1.87-1.87 12.4-12.4h-4.8V0h9.34v9.34h-2.67v-4.8l-12.4 12.4z" />
    </svg>
  );
};

export default SvgOpenInNew;
