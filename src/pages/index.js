import React, { useState } from 'react'

import Search from '../components/Search.tsx'
import Poem from '../components/Poem'
import SEO from '../components/seo'
import Sticky from '../components/Sticky';

import '../css/tachyons.css';
import '../css/index.css';

const betterSet = (s, f) => (arg) => {
  if (typeof arg === 'function') return f(arg(s))
  return f({ ...s, ...arg });
}

const IndexPage = () => {
  const [state, setstate] = useState({ valid: false, title: '', url: '', poemURL: '' })
  const setState = betterSet(state, setstate);
  return (
    <div className="mb5">
      <SEO title="wikiconga" />
      <div className="flex-ns ph3 ph0-ns mb4">
        <p style={{ flex: '0 0 20vw' }} className="b tr-ns pa3-ns">wikiconga</p>
        <p className="ma0 pt4-ns pr4" style={{ maxWidth: '50rem' }}>Inspired by the <a rel="noopener noreferrer" target="_blank" href="http://oulipo.net/">Oulipian</a> poem structure <a rel="noopener noreferrer" target="_blank" href="http://oulipo.net/fr/contraintes/litterature-definitionnelle">'Littérature définitionnelle'</a>, developed by <a rel="noopener noreferrer" target="_blank" href="https://en.wikipedia.org/wiki/Raymond_Queneau">Raymond Queneau</a>, <a rel="noopener noreferrer" target="_blank" href="https://en.wikipedia.org/wiki/Marcel_Breuer">Marcel Breuer</a> and <a rel="noopener noreferrer" target="_blank" href="https://en.wikipedia.org/wiki/Georges_Perec">Georges Perec</a>, which recursively generates poems by substituting words for there dictionary definitions. This tool generates poems by taking the words up until the first hyperlink on a Wikipedia page and then following that hyperlink and concatenating the initial text from the next link, it repeats this process recursively until a page is repeated.</p>
      </div>
      <Sticky className="w-100 z-4 bg-white"><Search {...state} setState={setState} /></Sticky>
      <div className="mv4-ns mv3" />
      { state.poemURL.length > 0 && <Poem url={state.poemURL} onRedirect={({ title, link }) => setState({ title, url: link, poemURL: link })} /> }
    </div>
  )
}

export default IndexPage
