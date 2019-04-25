import React from 'react'

import SEO from '../components/seo'
// import Tree from '../components/Tree'
// import CustomTree from '../components/CustomTree'
import RadialTreeD3 from '../components/RadialTreeD3'

import '../css/tachyons.css';
import '../css/index.css';

import data from '../components/Tree/linksToPhilosophy.json';

const TreePage = () => {
  return (
    <div className="">
      {/* <SEO title="wikiconga" /> */}
      {/* <CustomTree data={data} /> */}
      <RadialTreeD3 />
      {/* <Tree /> */}
    </div>
  )
}

export default TreePage
