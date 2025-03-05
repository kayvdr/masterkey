import classNames from "classnames";
import { memo } from "react";
import { Glyph } from "../../types";
import styles from "./Icon.module.css";

interface Props {
  glyph: Glyph;
  className?: string;
}

const Icon = ({ glyph: Glyph, className }: Props) => (
  <Glyph
    aria-hidden={true}
    focusable={false}
    role="img"
    className={classNames(styles.icon, className)}
  />
);

export default memo(Icon);
