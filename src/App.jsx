import React from "react";
import "./App.css";
import Header from "./components/header";
import Hero from "./components/hero";
import Riwayat from "./components/riwayat";
import Article from "./components/article";
import Footer from "./components/footer";
function App() {
  return (
    <div>
      <Header />
      <Hero />
      <div className="h-50"></div>
      <Riwayat />
      <div className="h-50"></div>
      <Article/>
      <Footer/>
    </div>
  );
}

export default App;
