import markdownIt from "markdown-it";
import markdownItAnchor from "markdown-it-anchor";
import markdownItFootnote from "markdown-it-footnote";
import markdownItPrism from "markdown-it-prism";

const markdown = markdownIt({ html: true, linkify: true });
markdown.use(markdownItAnchor, {
  level: [1, 2],
  permalink: markdownItAnchor.permalink.headerLink({
    safariReaderFix: true,
  }),
});
markdown.use(markdownItFootnote);
markdown.use(markdownItPrism);

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

export const md = (string) => markdown.render(string);
