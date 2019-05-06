import axios from 'axios';
import * as R from 'ramda';

// Get text up until word
const getTextUntil = (text, word) => {
	return new RegExp(`^(.|[\r\n])*?${word}`, 'gi').exec(text)[0];
}

const makePoem = async (url, callback = x => x, poem = [], visited = []) => {
  const { data } = await axios({ url: `https://dld7d563bh.execute-api.eu-west-2.amazonaws.com/dev/page?url=${url}` });
  const text = data.paragraphs.join('\n')
    .replace(/\(.*?\)/gmi, '')
    .replace(/\[.*?\]/gmi, '')
    .replace(/\n/gmi, '')

  console.log(data.links.map(x => x.text).sort())

  const links = data.links
    .filter(x => !R.contains(x.link, visited))
    // .filter(x => !/\#/.test(x.link))
    .filter(x => new RegExp(x.text, 'gi').test(text))
    .sort((a, b) => text.search(a.text) - text.search(b.text))

  console.log(text, links)
  const segment = new RegExp(`^(.|[\r\n])*?${R.head(links).text}`, 'gi').exec(text)[0]
  callback({ segment, url })
  if (poem.length > 4) return poem;
  return makePoem(R.head(links).link, callback, R.append({ segment, url }, poem), R.append(url, visited))
}

const main = (url, callback) => {
  let visited = [];
  makePoem(url, callback)
    .then(console.log)
}

export default main;
