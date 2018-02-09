const cheerio = require('cheerio');
const rp = require('request-promise');
const R = require('ramda');

const parseWiki = require('./parse-wiki-page');

const safe = R.curry((f, arg) => new Promise((resolve,  reject) => {
  let res = null;
  try { res = f(arg); }
  catch(err) { reject(err); }
  resolve(res);
}))

// Filter out links that dont excist in text
const filterAndSortLinks = ({ text, links }) => {
	const real_links = links
		.filter(x =>  
			x.linkText &&
			/^[\000-\177]*$/.test(x.linkText) &&
			!/\[|\]|\(|\)|\+|\*|\./i.test(x.linkText) && 
			new RegExp(x.linkText, 'g').test(text)
		)
		.sort((a, b) => text.search(a.linkText) - text.search(b.linkText))

	return { text, links: real_links };
}

// Filter out any matching links
const filterVisited = R.curry((visited, wiki) => {
	return Object.assign({}, wiki, { links: wiki.links.filter(x => !R.contains(x.href, visited)) });
})


// Get text up until word
const getTextUntil = (text, word) => {
	return new RegExp(`^(.|[\r\n])*?${word}`, 'gi').exec(text)[0];
}


const makePoem = (current, max, poem=[], visited=[], acc=0) => {
	console.log(visited.length, current)
	if (acc > max || acc > 500) return Promise.resolve(poem);
	return rp(current)
		.then(safe(parseWiki))
		.then(safe(filterAndSortLinks))
		.then(safe(filterVisited(visited)))
		.then(wiki => {
			if (wiki.links.length < 1) return poem;
			const nextPage = R.head(wiki.links)
			const nextText = getTextUntil(wiki.text, nextPage.linkText);
			const segment = Object.assign({}, nextPage, { text: nextText })
			return makePoem(nextPage.href, max, R.append(segment, poem), R.append(current, visited), acc + 1)
		})
}

const makeUntilFirstRepeat = (current, poem=[], visited=[], acc=0) => {
	if (R.contains(current, visited) || acc > 200) return Promise.resolve(poem);
	return rp(current)
		.then(safe(parseWiki))
		.then(safe(filterAndSortLinks))
		.then(wiki => {
			if (wiki.links.length < 1) return poem;
			const nextPage = R.head(wiki.links)
			const nextText = getTextUntil(wiki.text, nextPage.linkText);
			const segment = Object.assign({}, nextPage, { text: nextText })
			return makeUntilFirstRepeat(nextPage.href, R.append(segment, poem), R.append(current, visited), acc + 1)
		})
}

rp('http://en.wikipedia.org/wiki/London')
	.then(console.log)

// makeUntilFirstRepeat('http://en.wikipedia.org/wiki/London')
	// .then(poem => poem && poem.map(x => x.text).join('. '))
	// .then(console.log)	
