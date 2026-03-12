import './index.css'
import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HomePage from './components/pages/HomePage';
import IntervalTimerPage from './components/pages/IntervalTimerPage';
import WeightManagementPage from './components/pages/WeightManagementPage';
import ClassAttendancePage from './components/pages/ClassAttendancePage';
import ContactUsPage from './components/pages/ContactUsPage';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  return (
    <BrowserRouter>
      <div id="body-container">
        <main>
          <Header setCurrentPage={setCurrentPage} />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/intervaltimer" element={<IntervalTimerPage />} />
            <Route path="/weightmanagement" element={<WeightManagementPage />} />
            <Route path="/classattendance" element={<ClassAttendancePage />} />
            <Route path="/contactus" element={<ContactUsPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App;
