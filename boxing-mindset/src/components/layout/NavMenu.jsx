import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styling/layout.css';

const NavMenu = ({ setCurrentPage }) => {
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <nav className="nav-styles">
            <button className="hamburger-nav" onClick={toggleMenu}>☰</button>
            <ul className={`${menuOpen ? 'show' : ''}`}>
                <li><Link to="/" onClick={() => setCurrentPage('home')}>Home</Link></li>
                <li><Link to="/intervaltimer">Timer</Link></li>
                <li><Link to="/weightmanagement">Weight</Link></li>
                <li><Link to="/classattendance">Attendance</Link></li>
                <li><Link to="contactus">Contact Us</Link></li>
            </ul>
        </nav>
    )
}

export default NavMenu;