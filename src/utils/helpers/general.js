import { DateTime } from "luxon";
import { remark } from "remark";
import footnotes from "remark-footnotes";
import remarkRehype from "remark-rehype";
import rehypePrism from "rehype-prism-plus";
import rehypeStringify from "rehype-stringify";
import truncateHtml from "truncate-html";

// arrays
export const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let temp = shuffled[i];
    shuffled[i] = shuffled[j];
    shuffled[j] = temp;
  }
  return shuffled;
};

// countries
export const regionNames = new Intl.DisplayNames(["en"], { type: "region" });

export const getCountryName = (countryCode) =>
  regionNames.of(countryCode.trim()) || countryCode.trim();

export const parseCountryField = (countryField) => {
  if (!countryField) return null;

  const delimiters = [",", "/", "&", "and"];
  let countries = [countryField];

  delimiters.forEach((delimiter) => {
    countries = countries.flatMap((country) => country.split(delimiter));
  });

  return countries.map(getCountryName).join(", ");
};

// markdown
export const md = async (string) => {
  const processed = await remark()
    .use(footnotes, { inlineNotes: true })
    .use(remarkRehype)
    .use(rehypePrism, { ignoreMissing: true })
    .use(rehypeStringify)
    .process(string);

  return processed.toString();
};

// html
export const htmlTruncate = (content, limit = 50) =>
  truncateHtml(content, limit, {
    byWords: true,
    ellipsis: "...",
  });

export const escapeHtml = (str) =>
  str.replace(
    /["'&<>]/g,
    (char) =>
      ({
        '"': "&quot;",
        "'": "&#39;",
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
      })[char] || char
  );

// urls
export const encodeAmp = (url) => url.replace(/&/g, "&amp;");
export const removeTrailingSlash = (url) => url.replace(/\/$/, '');

// dates
export const dateToRFC822 = (date) =>
  DateTime.fromJSDate(date, { zone: "America/Los_Angeles" }).toFormat(
    "ccc, dd LLL yyyy HH:mm:ss ZZZ"
  );
