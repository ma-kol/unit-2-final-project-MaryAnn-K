import { useState } from 'react';

const ClassAttendancePage = () => {

    const ClassAttendance = () => {
        const [classes, setClasses] = useState([
            { name: "Boxing Basics (Adults)", date: "2025-11-24" },
            { name: "Advanced Boxing (Adults)", date: "2025-11-25" }
        ]);

        const [newClass, setNewClass] = useState({ name: "", date: "" });
        const [editClass, setEditClass] = useState({ name: "", date: "" });

        // Add Class Function
        const handleAdd = () => {
            if (newClass.name && newClass.date) {
                setClasses([...classes, newClass]); // adds class to new class
                setNewClass({ name: "", date: ""}); // resets input field
            }
        };

        // Delete Class Function
        const handleDelete = (index) => {
            const updatedClasses = [...classes];
            updatedClasses.splice(index, 1);
            setClasses(updatedClasses);
        }

        // Edit Class Function
    }

    return (
        <h2>Class Attendance</h2>
    )
}
export default ClassAttendancePage;