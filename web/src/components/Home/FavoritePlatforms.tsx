import SvgDropbox from "../icons/Dropbox";
import SvgEvernote from "../icons/Evernote";
import SvgFacebook from "../icons/Facebook";
import SvgGoogle from "../icons/Google";
import SvgInstagram from "../icons/Instagram";
import SvgSnapchat from "../icons/Snapchat";
import SvgTikTok from "../icons/Tiktok";
import SvgTinder from "../icons/Tinder";
import Box from "./Box";
import styles from "./FavoritePlatforms.module.css";

const FavoritePlatforms = () => (
  <section className="container">
    <h1 className="title">Favorite Platforms</h1>
    <div className={styles.boxes}>
      <Box glyph={SvgInstagram} label="Instagram" />
      <Box glyph={SvgFacebook} label="Facebook" />
      <Box glyph={SvgEvernote} label="Evernote" />
      <Box glyph={SvgSnapchat} label="Snapchat" />
      <Box glyph={SvgGoogle} label="Google" />
      <Box glyph={SvgTikTok} label="Tiktok" />
      <Box glyph={SvgDropbox} label="DropBox" />
      <Box glyph={SvgTinder} label="Tinder" />
    </div>
  </section>
);

export default FavoritePlatforms;
