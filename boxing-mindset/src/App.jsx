import './index.css'
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import { useState } from 'react';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  return (
    <>
      <div id="body-container">
        <Header setCurrentPage={setCurrentPage} />
        <main>

        </main>
        <Footer />
      </div>
    </>
  )
}

export default App;
