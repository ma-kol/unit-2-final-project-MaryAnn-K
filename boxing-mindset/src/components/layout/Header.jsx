import NavMenu from "./NavMenu";
import '../styling/layout.css';

const Header = ({ setCurrentPage }) => {
    return (
        <header>
            <h1 className="main-h1">Boxing Mindset</h1>
            <NavMenu setCurrentPage={setCurrentPage} />
        </header>
    );
};

export default Header;