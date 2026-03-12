const Button = ({ label, type = "button", onClick, disabled = false, style = {}, className = "" }) => {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            style={style}
            className={className}
        >
            {label}
        </button>
    )
};

export default Button;