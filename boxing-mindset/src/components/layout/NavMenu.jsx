import '../layout/layout.css';

const NavMenu = ({ setCurrentPage }) => {
    return (
        <nav className="nav-styles">
            <ul>
                <li onClick= { () => setCurrentPage('home')}>Home</li>
                <li>Timer</li>
                <li>Weight</li>
                <li>Attendance</li>
            </ul>
        </nav>
    )
}

export default NavMenu;