import React, { useState } from 'react'
import styled from 'styled-components';

import Search from '../components/Search.tsx'
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

const betterSet = (s, f) => (arg) => {
  if (typeof arg === 'function') return f(arg(s))
  return f({ ...s, ...arg });
}

const IndexPage = () => {
  const [state, setstate] = useState({ valid: false, title: '', url: '', poemURL: '' })
  const setState = betterSet(state, setstate);
  console.log(state)
  return (
    <div>
      <SEO title="wikiconga" />
      <div className="flex mb4">
        <TitleWrapper className="b tr">wikiconga</TitleWrapper>
        <p className="pt4-ns pt3 pr4" style={{ maxWidth: '50rem' }}>Inspired by the <a rel="noopener noreferrer" target="_blank" href="http://oulipo.net/">Oulipian</a> poem structure <a rel="noopener noreferrer" target="_blank" href="http://oulipo.net/fr/contraintes/litterature-definitionnelle">'Littérature définitionnelle'</a>, developed by <a rel="noopener noreferrer" target="_blank" href="https://en.wikipedia.org/wiki/Raymond_Queneau">Raymond Queneau</a>, <a rel="noopener noreferrer" target="_blank" href="https://en.wikipedia.org/wiki/Marcel_Breuer">Marcel Breuer</a> and <a rel="noopener noreferrer" target="_blank" href="https://en.wikipedia.org/wiki/Georges_Perec">Georges Perec</a>, which recursively generates poems by substituting words for there dictionary definitions. This tool generates poems by taking the words up until the first hyperlink on a Wikipedia page and then following that hyperlink and concatenating the initial text from the next link, it repeats this process recursively until a page is repeated.</p>
      </div>
      <Search {...state} setState={setState} />
      { state.poemURL.length > 0 && <Poem url={state.poemURL} onRedirect={({ title, link }) => setState({ title, url: link, poemURL: link })} /> }
    </div>
  )
}

export default IndexPage
