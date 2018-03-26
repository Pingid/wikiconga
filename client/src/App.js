import React, { Component } from 'react';
import styled from 'styled-components';
import ReactMarkdown from 'react-markdown';

import './styles/App.css';

import { get_short_poem, get_random_URI } from './utils/api';

import Loader from './components/Loader';

const Form = styled.form`
  border: 1px solid #555555;
  border-radius: 0;
`
const Input = styled.input`
  font-size: .618rem;
  flex: 1 1 100%;
  border-radius: 0;
  border: none;
  outline: none;
  &:focus { outline: none }
`

const GenerateButton = styled.button`
  flex: 1 1 10rem;
  border: none;
  border-left: 1px solid #999;
  cursor: pointer
`

const Wrapper = styled.div`
  padding: 6vh 10vw;
`

const Meta = styled.div`
  width: 100%;
  font-size: .618rem;
  line-height: 13px
`

const PoemLine = styled.span`
  cursor: pointer;
  margin: 2px 0px;;
  color: black;
  transition: .1s color;
  &:hover {
    color: red;
  }
`

const MiniButton = styled.div`
  position: relative;
  padding: .5rem;
  text-align: center;
  color: blue; 
  font-size: .618rem; 
  border: .5px solid black; 
  cursor: pointer;
`

const aboutMarkdown = `Inspired by the [Oulipian](http://oulipo.net/) poem structure ['Littérature définitionnelle'](http://oulipo.net/fr/contraintes/litterature-definitionnelle), developed by [Raymond Queneau](https://en.wikipedia.org/wiki/Raymond_Queneau), [Marcel Breuer](https://en.wikipedia.org/wiki/Marcel_Breuer) and [Georges Perec](https://en.wikipedia.org/wiki/Georges_Perec), which recursively generates poems by substituting words for there dictionary definitions. This tool generates poems by taking the words up until the first hyperlink on a Wikipedia page and then following that hyperlink and concatenating the initial text from the next link, it repeats this process recursively until a page is repeated.`

class App extends Component {
  state = { 
    search: 'https://en.wikipedia.org/wiki/Oulipo',
    poem: [],
    network: { fetching: false, err: '' },
    currentWiki: ''
  };
  render() {
    const { search, poem, network, currentWiki } = this.state;
    return (
      <Wrapper className="">
        <h4 className="m0 mt3">Wikiconga</h4>
        <Meta className="pt2 pl2">
          Author: <a href="http://danbeaven.co.uk">Dan Beaven</a>
          <br />
          Blog post: <a href="http://www.danbeaven.co.uk/blog/#/article/Who_are_the_Oulipo">Who are the Oulipo</a>
        </Meta>
        <div className="my3 markdown">
          <ReactMarkdown
            source={aboutMarkdown}
          />
        </div>
        <Form className="flex items-center" style={{ maxWidth: '30rem' }} onSubmit={this._handleGenerate.bind(this)}>
          <Input
            type="text"
            value={currentWiki.length > 1 ? currentWiki : search}
            placeholder="https://en.wikipedia.org/wiki/Wiki"
            className="p2"
            onChange={(e) => this.setState({ search: e.target.value })} />
          <GenerateButton 
            className="caps"
            onClick={this._handleGenerate.bind(this)}>
            <p className="m0 p0">{ network.fetching ? <Loader /> : 'Generate' }</p>
          </GenerateButton>
        </Form>
        <div className="flex items-center mb2" style={{ }}>
          <MiniButton className="caps mt1 mr1" onClick={this._handleRandom.bind(this)}>random</MiniButton>
          <p className="" style={{ color: 'red', fontSize: '.618rem' }}>{network.err}</p>
        </div>
        <p className="mt0" style={{ 
          minHeight: '27vh', 
          opacity: network.fetching ? .5 : 1,
          pointerEvents: network.fetching ? 'none' : 'auto' }}>
          {
            poem.map((x, i) => ([
              <PoemLine
                key={i}
                onClick={this._handlePoemClick.bind(this)}
                onMouseEnter={() => this.setState({ currentWiki: x.href })} 
                onMouseLeave={() => this.setState({ currentWiki: '' })}>
                {x.text}
              </PoemLine>,
              <br key={'br-'+i}/>
            ]))
          }
        </p>
      </Wrapper>
    );
  }
  _handleRandom() {
    this.setState({ network: { fetching: true, err: '' } });
    get_random_URI()
      .then(x => {
        this.setState({ search: x.uri, network: { fetching: false, err: '' } });
        return this._getPoem(x.uri);
      })
      .catch(err => {
        this.setState({ network: { fetching: false, err: 'Something went wrong try again' } });
      })
  }
  _handlePoemClick(e) {
    const { currentWiki } = this.state;
    this.setState({ search: currentWiki });
    this._handleGenerate.call(this, e);
  }
  _handleGenerate(e) {
    if (e) { e.preventDefault() }

    const { search } = this.state;
    const isWikiPage = new RegExp('wikipedia.org/wiki', 'gi')

    if (isWikiPage.test(search)) {
      return this._getPoem(search)
    }

    return this.setState({ 
      network: { 
        fetching: false, 
        err: 'cant handle this url try a different one' 
      }
    })
  }
  _getPoem(wikiPage) {
    if (this.state.network.fetching) {
      this.setState({ network: { fetching: true, err: 'Wait for last poem' } })
      return;
    }
    this.setState({ network: { fetching: true, err: '' } });
    return get_short_poem(wikiPage)
      .then(res => {
        return this.setState({ 
          poem: res.poem,
          network: { fetching: false, err: '' }
        })
      })
      .catch(err => {
        return this.setState({
          network: { fetching: false, err: 'Something went wrong try again or different page' }
        })
      });
  }
}

export default App;
