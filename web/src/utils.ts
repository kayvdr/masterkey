import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInMonths,
  differenceInYears,
} from "date-fns";
import SvgDiscord from "./components/icons/Discord";
import SvgDropbox from "./components/icons/Dropbox";
import SvgEvernote from "./components/icons/Evernote";
import SvgFacebook from "./components/icons/Facebook";
import SvgGoogle from "./components/icons/Google";
import SvgInstagram from "./components/icons/Instagram";
import SvgOnlyfans from "./components/icons/Onlyfans";
import SvgPinterest from "./components/icons/Pinterest";
import SvgReddit from "./components/icons/Reddit";
import SvgSnapchat from "./components/icons/Snapchat";
import SvgStackExchange from "./components/icons/StackExchange";
import SvgStackOverflow from "./components/icons/StackOverflow";
import SvgTikTok from "./components/icons/Tiktok";
import SvgTinder from "./components/icons/Tinder";
import SvgTwitch from "./components/icons/Twitch";
import SvgTwitter from "./components/icons/Twitter";
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
