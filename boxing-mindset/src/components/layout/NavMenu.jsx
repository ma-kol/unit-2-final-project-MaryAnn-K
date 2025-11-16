import { useState } from 'react';
import '../layout/layout.css';

const NavMenu = ({ setCurrentPage }) => {
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <nav className="nav-styles">
            <button className="hamburger-nav" onClick={toggleMenu}>☰</button>
            <ul className={menuOpen ? 'show' : ''}>
                <li onClick={() => setCurrentPage('home')}>Home</li>
                <li>Timer</li>
                <li>Weight</li>
                <li>Attendance</li>
                <li>Contact Us</li>
            </ul>
        </nav>
    )
}

export default NavMenu;