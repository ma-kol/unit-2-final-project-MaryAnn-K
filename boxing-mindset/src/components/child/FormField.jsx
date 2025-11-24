const FormField = ({ label, type, name, value, onChange, placeholder, ...props }) => {
    return (
        <div>
            <label htmlFor={name}>{label}</label>
            {type === "textarea" ? (
                <textarea
                    id={name}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    {...props}
                />
            ) : (
                <input
                    type={type}
                    id={name}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    {...props}
                />
            )}
        </div>
    );
};

export default FormField;