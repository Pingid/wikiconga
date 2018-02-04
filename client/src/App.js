import React, { Component } from 'react';
import styled from 'styled-components';

import './styles/App.css';

import { get_short_poem } from './utils/api';

import Loader from './components/Loader';

const Input = styled.input`
  font-size: .5rem;
  flex: 1 1 100%;
  border: 2px solid black;
  border-radius: 0;
  &:focus { outline: none }
`

const GenerateButton = styled.button`
  flex: 1 1 10rem;
  border: none;
  background-color: #1b1b1b;
  color: white;
  cursor: pointer
`

const Wrapper = styled.div`
  max-width: 40rem;
  margin: 2rem auto;
  padding: 0rem 2rem;
`

const Poem = styled.p`
  max-width: 30rem;
`

class App extends Component {
  state = { 
    search: '',
    poem: '',
    network: { fetching: false, err: '' }
  };
  render() {
    const { search, poem, network } = this.state;
    return (
      <Wrapper className="">
        <p className="m0 pb2 pl2" style={{ color: 'black', fontSize: '.5rem' }}>Copy and paste a wikipedia URL into box</p>
        <div className="flex">
          <Input
            type="text"
            value={search}
            placeholder="https://en.wikipedia.org/wiki/Wiki"
            className="p2 caps"
            onChange={(e) => this.setState({ search: e.target.value })} />
          <GenerateButton 
            className="caps"
            onClick={this._handleGenerate.bind(this)}>
            { network.fetching ? <Loader /> : 'Generate' }
          </GenerateButton>
        </div>
        <p className="m0 pl2 flex items-center" style={{ color: 'red', fontSize: '.5rem', height: '2rem' }}>{network.err}</p>
        <Poem className="mt0 px2">{poem}</Poem>
      </Wrapper>
    );
  }
  _handleGenerate() {
    const { search } = this.state;
    const isWikiPage = new RegExp('wikipedia.org\/wiki', 'gi')
    if (isWikiPage.test(search)) {
      const page = new RegExp('(wiki\/)(.*)[#?]', 'gi')
      return this._getPoem(page.exec(search + '#')[2].toLowerCase())
    }
    return this.setState({ 
      network: { 
        fetching: false, 
        err: 'cant handle this url try a different one' 
      }
    })
  }
  _getPoem(wikiPage) {
    this.setState({ network: { fetching: true, err: '' } });
    if (this.state.network.fetching) {
      this.setState({ network: { fetching: true, err: 'Wait for last poem' } })
      return;
    }
    return get_short_poem('/wiki/' + wikiPage)
      .then(res => {
        if (res.err) {
          console.log(res.err)
          return this.setState({ network: { fetching: false, err: 'Bad URL try different page' }})
        }
        return this.setState({ 
          poem: res.poem,
          network: { fetching: false, err: '' }
        })
      })
      .catch(err => this.setState({
        network: { fetching: false, err: 'The was an error try different page' }
      }));
  }
}

export default App;
