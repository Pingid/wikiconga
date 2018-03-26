const make_short_poem = require('../generators/short-poem');
const poems = require('../generators/poems');
const rp = require('request-promise')

module.exports = (app) => {

	app.get('/api/random-wiki', (req, res) => {
		rp('https://en.wikipedia.org/wiki/Special:Random', {
		  timeout: 2000,
		  resolveWithFullResponse: true,
		  followAllRedirects: true })
		.then(x => res.send({ uri: x.request.uri.href }))
		.catch(err => res.send({ uri: null, err }))
	})

	app.post('/api/short-poem', async (req, res) => {
		let page = req.body.page;
		make_short_poem(page)
			.then(poem => res.send({ page, poem }))
			.catch(err => res.send({ page, poem: '', err }))
	});
}