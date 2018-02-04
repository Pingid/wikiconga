const fs = require('fs');
const cheerio = require('cheerio');
const rp = require('request-promise');
const R = require('ramda');
const ProgressBar = require('progress');

const parseWiki = require('./parse-wiki-page');
const startWiki = '/wiki/Oulipo';

const pLog = x => { console.log(x); return x; };

const writePoem = (name, wikiURL, maxPages) => {
  const bar = new ProgressBar(
    ':bar :percent Elapsed: :elapseds ETA: :etas :wikiPage',
    { total: maxPages, width: 30 }
  );
  const stream = fs.createWriteStream(`../poems/${name}.json`);

  let visitedPages = [];

  const recursePages = (prev) => {
    if (prev.links.length <= 0 || visitedPages.length >= maxPages) {
      stream.write(`"\n\t"pages": "${JSON.stringify(visitedPages)}"`)
      stream.write('"\n}');
      stream.end();
      console.log(JSON.stringify(visitedPages, null, 2))
      return Promise.resolve('Done');
    }

    const nextWikiURL = prev.links[0].href;
    const nextWikiName = prev.links[0].linkText;

    visitedPages = [].concat([ nextWikiURL ], visitedPages);
    bar.tick({ wikiPage: nextWikiURL, message: 'Trying' })

    return rp(`https://en.wikipedia.org${nextWikiURL}`)
      .then(parseWiki)
      .then(({ text, links }) => ({
        text,
        links: links
          .filter(link => link.linkText && link.href)
          .filter(link => {
            try { return new RegExp(link.linkText, 'ig').test(text) }
            catch(err) { return false; }
          })
          .filter(link => !/[:%#]|upload\.wikimedia\.org/.test(link.href))
          .filter(link => !R.contains(link.href, visitedPages))
      }))
      .then(next => {
        const getTemp = (text, nextLink) => prev.text.match(new RegExp(`.+?${nextWikiName}`)) ? prev.text.match(new RegExp(`.+?${nextWikiName}`))[0] : '';
        const texUpToLink = getTemp(prev.text, nextWikiName);
        stream.write(`${texUpToLink}. `);
        return recursePages(next);
      })
      .catch(error => {
        console.log(error);
        return recursePages(R.assoc('links', R.tail(prev.links), prev))
      })
  }
  recursePages({ text: ' {\n\t"poem": "', links: [ { linkText: '{\n\t"poem": "', href: wikiURL } ]})
}

writePoem('Human_body', '/wiki/Human_body', 10000);











