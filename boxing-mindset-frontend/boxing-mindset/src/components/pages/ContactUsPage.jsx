import '../styling/contact.css'
import { useState } from 'react';
import Button from '../layout/Button';
import FormField from '../child/FormField';

const ContactUsPage = () => {

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        message: ""
    });

    // Handles input changes for form fields
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const maxCharacters = 500;
    const currentNumOfCharacters = formData.message.length;

    // Checks if any field is empty and disables/enables submit button
    const isFormComplete = formData.name && formData.email && formData.message;

    const [isDisabled, setIsDisabled] = useState(false);

    // Handles form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Form submitted successfully!');

        // Resets form fields upon submission
        setFormData({
            name: "",
            email: "",
            phone: "",
            message: ""
        });
    };

    return (
        <div className="contact-container">
            <h2 className="contact-header">Contact</h2>
            <form onSubmit={handleSubmit} className="contact-form">
                <FormField
                    label="name"
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                />

                <br />

                <FormField
                    label="email"
                    type="text"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                />

                <br />

                <FormField
                    label="phone"
                    type="phone"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number (optional)"
                />

                <br />

                <FormField
                    textarea
                    label="message"
                    type="textarea"
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Send us a message (max 500 characters)"
                    maxLength={maxCharacters}
                    rows={5}
                />

                <br />

                <div className="current-characters-counter">
                    {currentNumOfCharacters} / {maxCharacters}
                </div>

                <Button
                    type="submit"
                    label='Submit'
                    disabled={!isFormComplete}
                    className={isFormComplete ? "button-enabled" : "button-disabled"}
                />

                <br />

            </form>
        </div>
    )
}

export default ContactUsPage;