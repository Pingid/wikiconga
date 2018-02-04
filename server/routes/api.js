const make_short_poem = require('../generators/short-poem');

module.exports = (app) => {

	app.post('/api/short-poem', (req, res) => {
		make_short_poem(req.body.page)
			.then(poem => res.send({ poem }))
			.catch(err => res.send({ poem: '', err }))
	  // res.send({ express: 'Hello From Express' });
	});
}