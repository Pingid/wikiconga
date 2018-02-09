const rp = require('request-promise')
const parseWiki = require('../utils/parse-wiki-page');
const R = require('ramda');

const safe = R.curry((f, arg) => new Promise((resolve,  reject) => {
  let res = null;
  try { res = f(arg); }
  catch(err) { reject(err); }
  resolve(res);
}))

const grabTextUntilFirstLink = ({ text, links }) => text
  .replace(/\,/g, '')
  .split(' ')
  .reduce(({ text, nextLink }, word) => {
    if (nextLink) return { text, nextLink }
    return {
      text: text + word + ' ',
      nextLink: R.prop('href', R.find(x => x.linkText === word, links))
    };
  }, { text: '', nextLink: null });

const constructPoem = (poem, wikiPage, visitedPages) => {
  if (wikiPage) {
    return rp(wikiPage)
      .then(safe(parseWiki))
      .then(grabTextUntilFirstLink)
      .then(({ text, nextLink }) => {
        const addLine = R.append({ text: text.trim() + '. ', href: wikiPage }, poem);
        if (R.contains(nextLink, visitedPages)) {
          return addLine;
        }
        return constructPoem(addLine, nextLink, [].concat(visitedPages, [nextLink]));
      })
    }
}

make_short_poem = (page) => constructPoem([], page, [page])

module.exports = make_short_poem