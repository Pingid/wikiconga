import React, { useState } from 'react';
import axios from 'axios';
import classNames from 'classnames';
import styled from 'styled-components';

const DropDown = styled.div`
  max-height: ${({ open }) => open ? 10 : 0}rem;
  overflow: ${({ open }) => open ? 'scroll' : 'hidden'};
  transition: .3s;
  margin-top: -1px;
`;

const Wrapper = styled.div`
  margin-left: 20vw;
  max-width: 30rem;
  @media (max-width: 500px) {
    max-width: 100%;
    margin-left: 0;
    padding-left: 1rem;
  }
`;

const SearchInput = styled.input`
  transition: .2s;
  &::-webkit-input-placeholder {
    color: #ddd;
    text-transform: capitalize;
  }
  &:focus {
    color: #fff !important;
    &::-webkit-input-placeholder { color: #555; }
  }
`;

let request = '';

const getSuggestions = (search) => {
  request = search;
  return axios.get(`https://kmo5ch0uh5.execute-api.eu-west-2.amazonaws.com/dev/search?search=${search}`, { headers: { contentType: 'application/json', } })
    .then(({ data }) => request === search ? data : null)
    .then((data) => data && data[1].map((title, i) => ({
      title,
      description: data[2][i],
      link: data[3][i]
    })))
    .catch(err => console.log(err))
}

let fetchingTitle = '';

export default ({ title, url, valid, poemURL, onSearch, setState }) => {
  const [ suggestions, setSuggestions ] = useState([]);
  const [ selectOpen, setSelect ] = useState(false);

  const searchSuggestions = async (value) => {
    const suggestions = await getSuggestions(value);
    if (suggestions) { setSuggestions(suggestions); setSelect(true) }
  }

  const handleSuggestionSelect = (x) => {
    setState({ title: x.title, url: x.link, valid: true });
    setSelect(false); 
  }

  const handleTitle = (e) => {
    setState({ title: e.target.value });
    searchSuggestions(e.target.value);
  }

  const handleURL = async (e) => {
    const inputString = e.target.value;
    fetchingTitle = inputString;
    setState({ valid: false, url: inputString });
    return axios.get(`https://kmo5ch0uh5.execute-api.eu-west-2.amazonaws.com/dev/page?url=${e.target.value}`)
      .then(x => {
        const [_, search] = /url=(.*)?/.exec(x.config.url)
        if (fetchingTitle === inputString && x.data.paragraphs.length > 1) { 
          setState({ valid: true, title: x.data.title, url: inputString }); 
        }
      })
      .catch(x => null)
  }

  const handleSubmit = (e) => { 
    e.preventDefault(); 
    if (valid) { onSearch(url); }
  }

  const buttonValid = (valid && poemURL !== url);

  return (
    <Wrapper className="border border-black w-full mb4 pr3" onMouseLeave={() => setSelect(false)}>
      <form className="flex flex-wrap" onSubmit={handleSubmit}>
        <small className="w-100"><input
          className="bw0 w-100 pl2 pv2 o-40"
          type="text" 
          placeholder="https://en.wikipedia.org/wiki/Oulipo"
          value={url}
          onChange={handleURL} /></small>
        <div className="w-100">
          <SearchInput
            className={classNames('bw0 bg-black off-white w-100 pl2 pv3 bl bt br')}
            type="text"
            placeholder="search"
            value={title}
            onFocus={() => { suggestions.length > 0 && setSelect(true); }}
            onChange={handleTitle} />
          <div className="relative border-box w-100">
            <DropDown className="bg-black white absolute z-4 p1 w-100" open={selectOpen}>
              {
                suggestions.map(x => (
                  <div key={x.link} className="pl2 pt1 pointer hover-bg-blue">
                    <div key={x.link} onClick={() => handleSuggestionSelect(x)}>
                      {x.title}
                    </div>
                  </div>
                ))
              }
            </DropDown>
          </div>
        </div>
        <button disabled={!buttonValid} type="submit" className={classNames('pa2 bw0 pointer mv2', { 'off-white bg-black hover-white': buttonValid, 'o-20 bg-white black': !buttonValid })}>
          1 - 2 - 3
        </button>
      </form>
    </Wrapper>
  )
}
