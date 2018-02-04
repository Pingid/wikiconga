const fs = require('fs');
const cheerio = require('cheerio');
const rp = require('request-promise');
const R = require('ramda');
const ProgressBar = require('progress');

const parseWiki = require('./parse-wiki-page');
const popularWikis = require('./popularWikis');

const start = '/wiki/Guernsey';

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
    return rp(`https://en.wikipedia.org${wikiPage}`)
      .then(safe(parseWiki))
      .then(grabTextUntilFirstLink)
      .then(({ text, nextLink }) => {
        const addLine = poem + text.trim() + '. ';
        if (R.contains(nextLink, visitedPages)) {
          return addLine;
        }
        return constructPoem(addLine, nextLink, [].concat(visitedPages, [nextLink]));
      })
    }
}

const writePoemsFile = (poemLinks) => {
  const stream = fs.createWriteStream("popularWikiPoems.js");

  const bar = new ProgressBar(
    ':bar :percent Elapsed: :elapseds ETA: :etas :wikiPage :message',
    { total: poemLinks.length, width: 30 }
  );
  const startTime = Date.now();
  let numberCompleted = 0;

  stream.once('open', function(fd) {
    stream.write('module.exports = [\n');

    poemLinks.forEach((wiki, index) => {
      constructPoem('', wiki.url, [ wiki.url ])
        .then(poem => {
          numberCompleted += 1;
          bar.tick({ wikiPage: wiki.url, message: 'Success' });
          if (!poem) return null;

          if (poem.split(' ').length > 5) {
            stream.write('\t' + '`' + poem.replace(/\r?\n|\r/g, '').trim() + '`,\n')
          }

          if (numberCompleted >= poemLinks.length) {
            stream.write('];\n');
            stream.end();
          }
        })
        .catch(error => bar.tick({ wikiPage: error.options.uri, message: 'Failed' }))
    })

  })
}

writePoemsFile(R.take(popularWikis.length, popularWikis));
