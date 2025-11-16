import './index.css'
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Hero from './components/layout/Hero'
import { useState } from 'react';
import HomePage from './components/pages/HomePage';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  return (
    <>
      <div id="body-container">
        <Header setCurrentPage={setCurrentPage} />
        <main>
          <HomePage />
          <Hero />
        </main>
        <Footer />
      </div>
    </>
  )
}

export default App;
