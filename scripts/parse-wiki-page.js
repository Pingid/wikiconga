const R = require('ramda');
const cheerio = require('cheerio');

const parseHtml = (html) => {
  const $ = cheerio.load(html);

  const insideParens = /\s\([^)]*\)/g;
  const insideSquareBrackets = /\[\d*\]/g;

  const rawText = $('.mw-parser-output').children().filter('p').text();

  const cleanText = R.compose(
    text => text.replace(insideParens, ''),
    text => text.replace(insideSquareBrackets, ''))(rawText);

  const links = Array.from(
    $('p')
    .find('a')
    .map((num, elem) => ({ href: elem.attribs.href, linkText: elem.children[0].data }))
  );
  return { text: cleanText, links };
}

module.exports = parseHtml;
