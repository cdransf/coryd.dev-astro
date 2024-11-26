import { convert } from "html-to-text";
import { format } from "date-fns-tz";
import sanitizeHtml from "sanitize-html";
import markdownIt from "markdown-it";
import markdownItAnchor from "markdown-it-anchor";
import markdownItFootnote from "markdown-it-footnote";
import hljs from "highlight.js";
import truncateHtml from "truncate-html";

// arrays
export const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// countries
const regionNames = new Intl.DisplayNames(["en"], { type: "region" });

export const getCountryName = (countryCode) => {
  try {
    return regionNames.of(countryCode.trim()) || countryCode.trim();
  } catch {
    return countryCode.trim();
  }
};

export const parseCountryField = (countryField) => {
  if (!countryField) return null;

  const delimiters = [",", "/", "&", "and"];
  return delimiters
    .reduce(
      (countries, delimiter) =>
        countries.flatMap((country) => country.split(delimiter)),
      [countryField]
    )
    .map(getCountryName)
    .join(", ");
};

// html
export const htmlTruncate = (content, limit = 50) =>
  truncateHtml(content, limit, {
    byWords: true,
    ellipsis: "...",
  });

export const htmlToText = (html) =>
  convert(html, {
    wordwrap: false,
    selectors: [
      { selector: "a", options: { ignoreHref: true } },
      { selector: "h1", options: { uppercase: false } },
      { selector: "h2", options: { uppercase: false } },
      { selector: "h3", options: { uppercase: false } },
      { selector: "*", format: "block" },
    ],
  });

export const sanitizeContent = (html) =>
  sanitizeHtml(html, {
    allowedTags: [
      "p",
      "ul",
      "ol",
      "li",
      "strong",
      "em",
      "a",
      "img",
      "blockquote",
      "pre",
      "code",
      "h1",
      "h2",
      "h3",
    ],
    allowedAttributes: {
      a: ["href"],
      img: ["src", "alt"],
    },
  });

// markdown
const markdown = markdownIt({
  html: true,
  linkify: true,
  breaks: true,
  highlight: (code, lang) => {
    if (lang && hljs.getLanguage(lang))
      return hljs.highlight(code, { language: lang }).value;
    return hljs.highlightAuto(code).value;
  },
});
markdown
  .use(markdownItAnchor, {
    level: [1, 2],
    permalink: markdownItAnchor.permalink.headerLink({
      safariReaderFix: true,
    }),
  })
  .use(markdownItFootnote);

export const md = (string) => markdown.render(string);

// urls
export const encodeAmp = (url) => url.replace(/&/g, "&amp;");
export const removeTrailingSlash = (url) => url.replace(/\/$/, "");

export const isExcludedPath = (path, exclusions) =>
  exclusions.some((exclusion) => path.includes(exclusion));

// dates
export const dateToRFC822 = (date) =>
  format(date, "EEE, dd MMM yyyy HH:mm:ss XXX", {
    timeZone: "America/Los_Angeles",
  });
