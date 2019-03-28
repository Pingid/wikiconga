import React, { useState } from 'react';
import axios from 'axios';

let request = '';

const getSuggestions = (search) => {
  const limit = 10;
  request = search;
  return axios({ url: `https://en.wikipedia.org/w/api.php?action=opensearch&format=json&formatversion=2&search=${search}&namespace=0&limit=${limit}&suggest=true`, })
    .then(({ data }) => request === search ? data : null)
    .then((data) => data && data[1].map((title, i) => ({
      title,
      description: data[2][i],
      link: data[3][i]
    })))
    .catch(err => console.log(err))
}

export default ({ onSearch }) => {
  const [ title, setTitle ] = useState('');
  const [ url, setUrl ] = useState('');
  const [ suggestions, setSuggestions ] = useState([]);
  const [ selectOpen, setSelect ] = useState(true);

  const searchSuggestions = async (value) => {
    const suggestions = await getSuggestions(value);
    if (suggestions) { setSuggestions(suggestions); setSelect(true) }
  }

  return (
    <div className="border border-black w-full" onMouseLeave={() => setSelect(false)}>
      <div className="flex flex-col">
        <input
          className="p-3 text-xs border-b-1 w-full"
          type="text" value={url}
          onChange={(e) => setUrl(e.target.value)} />
        <input
          className="p-3 text-m border-black w-full"
          type="text"
          value={title}
          onFocus={() => { setSelect(true); }}
          onChange={(e) => { setTitle(e.target.value); searchSuggestions(e.target.value) }} />
      </div>
      <div className="border-box p1">
        <div className="absolute bg-white border border-black w-full">
          {
            selectOpen && suggestions.map(x => (
              <div key={x.link} className="hover:bg-blue">
                <div key={x.link} onClick={() => { setTitle(x.title); setUrl(x.link); setSelect(false); onSearch(x.link) }}>
                  {x.title}
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}
