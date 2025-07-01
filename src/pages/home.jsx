import React from 'react'
import Header from '../components/header'
import Riwayat from '../components/riwayat'
import Footer from '../components/footer'
import Hero from '../components/hero'

function Home({ onLogout }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header onLogout={onLogout} />
      <main className="flex-grow">
        <Hero />
        <Riwayat />
      </main>
      <Footer />
    </div>
  );
}

export default Home;