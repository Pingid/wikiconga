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
  const limit = 10;
  request = search;
  return axios.get(`https://en.wikipedia.org/w/api.php?action=opensearch&format=json&formatversion=2&search=${search}&namespace=0&limit=${limit}&suggest=true&origin=*`, { headers: { contentType: 'application/json', } })
    .then(({ data }) => request === search ? data : null)
    .then((data) => data && data[1].map((title, i) => ({
      title,
      description: data[2][i],
      link: data[3][i]
    })))
    .catch(err => console.log(err))
}

export default (props) => {
  const [ title, setTitle ] = useState('');
  const [ oldURL, setoldURL ] = useState('');
  const [ valid, setvalid ] = useState(false);
  const [ url, setUrl ] = useState('');
  const [ suggestions, setSuggestions ] = useState([]);
  const [ selectOpen, setSelect ] = useState(false);

  const [ delay, setdelay ] = useState(false);
  
  if (props.url.length > 1 && props.url !== oldURL && props.url !== url) { 
    setoldURL(props.url); setUrl(props.url); setTitle(props.title); setSuggestions([]) 
  }

  const searchSuggestions = async (value) => {
    const suggestions = await getSuggestions(value);
    if (suggestions) { setSuggestions(suggestions); setSelect(true) }
  }

  const handleSuggestionSelect = (x) => { setTitle(x.title); setUrl(x.link); setvalid(true); setSelect(false); }

  const handleURL = async (e) => {
    setUrl(e.target.value);
    setvalid(false)
    const { data } = await axios.get(`https://kmo5ch0uh5.execute-api.eu-west-2.amazonaws.com/dev/page?url=${e.target.value}`);
    if (data.paragraphs.length > 1) { setTitle(data.title); setvalid(true); }
  }

  const handleSubmit = (e) => { 
    e.preventDefault(); 
    if (valid) { props.onSearch(url); }
    setdelay(true);
    setTimeout(() => setdelay(false), 2000)
  }

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
            className={classNames('bg-black off-white w-100 pl2 pv3 bl bt br')}
            type="text"
            placeholder="search"
            value={title}
            onFocus={() => { suggestions.length > 0 && setSelect(true); }}
            onChange={(e) => { setTitle(e.target.value); searchSuggestions(e.target.value) }} />
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
        <button disabled={!valid} type="submit" className={classNames('pa2 bw0 pointer mv2', { 'off-white bg-black hover-white': (valid && !delay), 'o-20 bg-white black': (!valid || delay) })}>
          concatenate
        </button>
      </form>
    </Wrapper>
  )
}
