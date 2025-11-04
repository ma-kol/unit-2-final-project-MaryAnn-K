const Footer = () => {

    let currentYear = new Date().getFullYear();

    return (
        <footer>
            <div>&copy; {currentYear} Boxing Mindset</div>
        </footer>
    );
};

export default Footer;