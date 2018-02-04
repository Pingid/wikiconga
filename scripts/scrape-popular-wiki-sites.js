const fs = require('fs');
const cheerio = require('cheerio');
const rp = require('request-promise');
const R = require('ramda');
// const makePoem = require('./wiki-scrape');

const parseHtml = (html) => {
  const $ = cheerio.load(html);
  const list = Array.from($('.wikitable a')
    .map((num, elem) => ({ url: elem.attribs.href, title: elem.children[0].data })))
  return list;
}

const getPopularWikiSites = () => {
  return rp(`https://en.wikipedia.org/wiki/Wikipedia:Multiyear_ranking_of_most_viewed_pages`)
    .then(parseHtml)
}

getPopularWikiSites()
  .then(x => { console.log(x); return x; })
  .then(list => {
    const stream = fs.createWriteStream("popularWikis.js");
    stream.once('open', function(fd) {
      stream.write('module.exports = [\n');
      list.forEach(site => {
        stream.write(`\t{ url: "${site.url}", title: "${site.title}" },\n`)
      })
      stream.write('];\n');
      stream.end();
    });
  })
