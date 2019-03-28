import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as R from 'ramda';

import Poem from '../utils/poem';

const buildPoem = (url: string): { lines: { link: string, text: string }[], poem: Poem, archive: Poem[] } => {
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

export default (props: { url: string, onRedirect: (n: string) => void }): JSX.Element => {
  const { lines, poem } = buildPoem(props.url);

  return (
    <div>
      { lines.map((x, i) => (
        <div className="flex" key={x.title + i}>
          <p className="w4 tr o-2">{x.title}</p>
          <p className="pl2" onClick={() => props.onRedirect(x.link)} key={i}>{x.text}</p>
        </div>
      ))}
    </div>
  )
}
