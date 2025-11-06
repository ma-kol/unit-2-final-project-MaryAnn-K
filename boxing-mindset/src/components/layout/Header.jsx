import NavMenu from "./NavMenu";
import '../layout/layout.css';

const Header = ({ setCurrentPage }) => {
    return (
        <header>
            <h1>Boxing Mindset</h1>
            <NavMenu setCurrentPage={setCurrentPage} />
        </header>
    );
};

export default Header;