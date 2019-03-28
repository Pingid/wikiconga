import React, { useState } from 'react'
import styled from 'styled-components';

import Search from '../components/Search'
import Poem from '../components/Poem'
import SEO from '../components/seo'

import '../css/tachyons.css';
import '../css/index.css';

const TitleWrapper = styled.p`
  flex: 0 0 20vw;
  padding: 2rem;
  @media (max-width: 500px) {
    padding: 1rem;
    flex: 0 0 7rem;
    width: 7rem;
    overflow: hidden;
  }
`;

const IndexPage = () => {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  return (
    <div>
      <SEO title="Home" keywords={[`gatsby`, `application`, `react`]} />
      <div className="flex mb4">
        <TitleWrapper className="b tr">wikiconga</TitleWrapper>
        <p className="pt4-ns pt3 pr4" style={{ maxWidth: '50rem' }}>Inspired by the <a rel="noopener noreferrer" target="_blank" href="http://oulipo.net/">Oulipian</a> poem structure <a rel="noopener noreferrer" target="_blank" href="http://oulipo.net/fr/contraintes/litterature-definitionnelle">'Littérature définitionnelle'</a>, developed by <a rel="noopener noreferrer" target="_blank" href="https://en.wikipedia.org/wiki/Raymond_Queneau">Raymond Queneau</a>, <a rel="noopener noreferrer" target="_blank" href="https://en.wikipedia.org/wiki/Marcel_Breuer">Marcel Breuer</a> and <a rel="noopener noreferrer" target="_blank" href="https://en.wikipedia.org/wiki/Georges_Perec">Georges Perec</a>, which recursively generates poems by substituting words for there dictionary definitions. This tool generates poems by taking the words up until the first hyperlink on a Wikipedia page and then following that hyperlink and concatenating the initial text from the next link, it repeats this process recursively until a page is repeated.</p>
      </div>
      <Search url={url} title={title} onSearch={setUrl} />
      { url.length > 0 && <Poem url={url} onRedirect={({ title, link }) => { setTitle(title); setUrl(link); }} /> }
    </div>
  )
}

export default IndexPage
