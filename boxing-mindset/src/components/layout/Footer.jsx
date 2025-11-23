import { Link } from 'react-router-dom';

const Footer = () => {

    let currentYear = new Date().getFullYear();

    return (
        <footer>
            <Link to="/contactus" className="footer-contact-link">
                &copy; {currentYear} Boxing Mindset
            </Link>
        </footer>
    );
};

export default Footer;