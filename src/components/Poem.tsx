import React, { useState, useEffect } from 'react';
import Poem from '../utils/poem';
import styled from 'styled-components';

const buildPoem = (url: string): { lines: { title: string, link: string, text: string }[], poem: Poem, archive: Poem[] } => {
  const [ archive, setArchive ] = useState([]);
  const [ poem, setPoem ] = useState(null);
  const [ lines, updateLines ] = useState([]);
  const [ lastUrl, setLastUrl ] = useState('');

  useEffect(() => {
    if (lastUrl !== url) {
      setLastUrl(url);
      if (poem) { poem.finish(); setArchive([].concat(archive, poem)) }
      const newPoem = new Poem('firstRepeat');
      newPoem.build(url, 100)
      newPoem.on('lines', updateLines)
      setPoem(newPoem)
    }
    return () => null;
  })
  

  return { lines, poem, archive };
}

const Title = styled.p`
  flex: 0 0 20vw;
  @media (max-width: 500px) {
    flex: 0 0 6rem;
    width: 6rem;
    overflow: hidden;
  }
`;

export default (props: { url: string, onSave: () => null,  onRedirect: (page: { title: string, link: string }) => void }): JSX.Element => {
  const { lines, poem } = buildPoem(props.url);

  return (
    <div className="mb5">
      { 
        lines.map((x, i) => (
          <div className="flex pt2" key={x.title + i}>
            <Title className="ma0 w4 tr o-40 pr3 pl1 pointer hover-blue" onClick={() => props.onRedirect(x)}>
              <small>{x.title}</small>
            </Title>
            <p className="ma0 pr3" style={{ flex: '0 1 50rem' }} key={i}>{x.text}</p>
          </div>
        )).concat([
          // poem.finished && <div className="flex"><Title className="tr b pr3 pointer" onClick={props.onSave}>save</Title></div>
        ])
      }
    </div>
  )
}
