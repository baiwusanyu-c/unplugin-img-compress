// eslint-disable-next-line no-unused-vars
import React from 'react'
import Img from '../public/home.png'
import test2 from '../public/runtime-build-assets/test2.png'
import test from '../public/runtime-build-assets/test.png'
const App = () => {
  return (
      <div>
          <img src={Img} />
          <img src={test2} />
          <img src={test} />
          <h1>Hello, React with Webpack!</h1>
      </div>
  )
}

export default App
