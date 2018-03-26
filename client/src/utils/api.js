const options = opts => Object.assign({
	method: 'GET', 
  headers: new Headers({ 'Content-Type': 'application/json' }) 
}, opts);

export const get_random_URI = () => fetch('/api/random-wiki', options())
	.then(res => res.json())
	.then(res => new Promise((resolve, reject) => {
		if (res.err || !res.uri) return reject(res.err);
		return resolve(res);
	}))

export const get_short_poem = (wikipage) => fetch('/api/short-poem', options({ 
	  method: 'POST', 
	  body: JSON.stringify({ page: wikipage }),
	}))
	.then(res => res.json())
	.then(res => new Promise((resolve, reject) => {
		if (res.err || !res.poem) return reject(res.err);
		return resolve(res);
	}))