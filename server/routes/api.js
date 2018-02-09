const make_short_poem = require('../generators/short-poem');
const poems = require('../generators/poems');

module.exports = (app) => {

	app.post('/api/short-poem', (req, res) => {
		// poems.firstRepeat(req.body.page)
		// 	.then(poem => res.send({ poem }))
		// 	.catch(err => res.send({ poem: '', err }))
		make_short_poem(req.body.page)
			.then(poem => res.send({ poem }))
			.catch(err => res.send({ poem: '', err }))
	});
}