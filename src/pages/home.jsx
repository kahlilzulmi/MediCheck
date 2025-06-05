import React from 'react'
import Header from '../components/header'
import Riwayat from '../components/riwayat'
import Footer from '../components/footer'
import Hero from '../components/hero'

function Home() {
  return (
  <div>
    <Header/>
    <Hero/>
    <div className='h-50'></div>
    <Riwayat/>
    <div className='h-50'></div>
    <Footer/>
  </div>
  )
}

export default Home