const options = opts => Object.assign({
	method: 'GET', 
  headers: new Headers({ 'Content-Type': 'application/json' }) 
}, opts);

export const get_short_poem = async (wikipage) => {
	const response = await fetch('/api/short-poem', options({ 
	  method: 'POST', 
	  body: JSON.stringify({ page: wikipage }),
	}));
	const body = await response.json();
	if (response.status !== 200) throw Error(body.message);
	return body;
}	