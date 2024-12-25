import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInMonths,
  differenceInYears,
} from "date-fns";
import SvgCoursera from "./components/icons/Coursera";
import SvgDiscord from "./components/icons/Discord";
import SvgDribbble from "./components/icons/Dribbble";
import SvgDropbox from "./components/icons/Dropbox";
import SvgElevenlabs from "./components/icons/Elevenlabs";
import SvgEvernote from "./components/icons/Evernote";
import SvgFacebook from "./components/icons/Facebook";
import SvgFigma from "./components/icons/Figma";
import SvgGoogle from "./components/icons/Google";
import SvgHackerrank from "./components/icons/Hackerrank";
import SvgInstagram from "./components/icons/Instagram";
import SvgMedium from "./components/icons/Medium";
import SvgMeetup from "./components/icons/Meetup";
import SvgOnlyfans from "./components/icons/Onlyfans";
import SvgPexels from "./components/icons/Pexels";
import SvgPhotopea from "./components/icons/Photopea";
import SvgPinterest from "./components/icons/Pinterest";
import SvgPixabay from "./components/icons/Pixabay";
import SvgReddit from "./components/icons/Reddit";
import SvgSnapchat from "./components/icons/Snapchat";
import SvgSoundcloud from "./components/icons/Soundcloud";
import SvgSpotify from "./components/icons/Spotify";
import SvgStackExchange from "./components/icons/StackExchange";
import SvgStackOverflow from "./components/icons/StackOverflow";
import SvgTikTok from "./components/icons/Tiktok";
import SvgTinder from "./components/icons/Tinder";
import SvgTwitch from "./components/icons/Twitch";
import SvgTwitter from "./components/icons/Twitter";
import SvgUdemy from "./components/icons/Udemy";
import SvgUnsplash from "./components/icons/Unsplash";
import SvgVimeo from "./components/icons/Vimeo";
import SvgX from "./components/icons/X";
import { Glyph } from "./types";

export const getDiff = (createdAt: string) => {
  const date = new Date(createdAt);
  const today = new Date();

  const minutes = differenceInMinutes(today, date);
  const hours = differenceInHours(today, date);
  const days = differenceInDays(today, date);
  const months = differenceInMonths(today, date);
  const years = differenceInYears(today, date);

  if (years) return `${years}y`;
  if (months) return `${months}M`;
  if (days) return `${days}d`;
  if (hours) return `${hours}h`;

  return `${minutes}m`;
};

export const logoMapping: { [key in string]: Glyph } = {
  Instagram: SvgInstagram,
  Facebook: SvgFacebook,
  Snapchat: SvgSnapchat,
  Google: SvgGoogle,
  Tinder: SvgTinder,
  Evernote: SvgEvernote,
  Tiktok: SvgTikTok,
  Twitter: SvgTwitter,
  Dropbox: SvgDropbox,
  Onlyfans: SvgOnlyfans,
  Discord: SvgDiscord,
  Pinterest: SvgPinterest,
  Reddit: SvgReddit,
  "Stack Exchange": SvgStackExchange,
  "Stack Overflow": SvgStackOverflow,
  Twitch: SvgTwitch,
  Dribbble: SvgDribbble,
  X: SvgX,
  Figma: SvgFigma,
  Pexels: SvgPexels,
  Pixabay: SvgPixabay,
  Unsplash: SvgUnsplash,
  Elevenlabs: SvgElevenlabs,
  Spotify: SvgSpotify,
  SoundCloud: SvgSoundcloud,
  Vimeo: SvgVimeo,
  Coursera: SvgCoursera,
  Udemy: SvgUdemy,
  Medium: SvgMedium,
  Meetup: SvgMeetup,
  Photopea: SvgPhotopea,
  Hackerrank: SvgHackerrank,
};

export const getSearchParams = (search: string, key: string) => {
  const searchParams = new URLSearchParams(search);

  return searchParams.get(key);
};

export const setSearchParams = (key: string, value: string) => {
  const searchParams = new URLSearchParams(location.search);

  searchParams.set(key, value);

  window.history.replaceState(
    {},
    "",
    `${location.pathname}?${searchParams.toString()}`
  );
};
