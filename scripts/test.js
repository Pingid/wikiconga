const rp = require('request-promise');
const parseWiki = require('./parse-wiki-page');

rp(`https://en.wikipedia.org/wiki/London`)
  .then(parseWiki)
  .then(x => console.log(x))
  .then(x => console.log(x))
  .catch(err => { console.log('catch'); })
  .then(x => { console.log('then2', x); return x })



const parsePromise = (jsonString) => new Promise((reject, resolve) => {
	let res;
	try  {
		res = JSON.parse(jsonString)
	} catch (err) { return reject(err) }
	return resolve(res)
})
