import { Glyph } from "../../types";
import Container from "../Container";
import SvgDropbox from "../icons/Dropbox";
import SvgEvernote from "../icons/Evernote";
import SvgFacebook from "../icons/Facebook";
import SvgGoogle from "../icons/Google";
import SvgInstagram from "../icons/Instagram";
import SvgReddit from "../icons/Reddit";
import SvgTikTok from "../icons/Tiktok";
import SvgTinder from "../icons/Tinder";
import Icon from "../ui/Icon";
import styles from "./FavoritePlatforms.module.css";

const FavoritePlatforms = () => (
  <section>
    <Container>
      <h1 className="title">Favorite Platforms</h1>
      <div className={styles.boxes}>
        <Box glyph={SvgInstagram} label="Instagram" />
        <Box glyph={SvgFacebook} label="Facebook" />
        <Box glyph={SvgEvernote} label="Evernote" />
        <Box glyph={SvgReddit} label="Reddit" />
        <Box glyph={SvgGoogle} label="Google" />
        <Box glyph={SvgTikTok} label="Tiktok" />
        <Box glyph={SvgDropbox} label="DropBox" />
        <Box glyph={SvgTinder} label="Tinder" />
      </div>
    </Container>
  </section>
);

interface BoxProps {
  glyph: Glyph;
  label: string;
}

const Box = ({ glyph, label }: BoxProps) => (
  <a href={`/search?q=${label.toLowerCase()}`} className={styles.box}>
    <Icon glyph={glyph} className={styles.boxIcon} />
    <h3 className={styles.boxTitle}>{label}</h3>
  </a>
);

export default FavoritePlatforms;
