import React, { useState } from 'react'

import Search from '../components/Search'
import Poem from '../components/Poem'
import SEO from '../components/seo'

import '../css/tachyons.css';

const IndexPage = () => {
  const [url, setUrl] = useState('');
  return (
    <div>
      <SEO title="Home" keywords={[`gatsby`, `application`, `react`]} />
      <Search onSearch={setUrl} />
      { url.length > 0 && <Poem url={url} onRedirect={setUrl} /> }
    </div>
  )
}

export default IndexPage
