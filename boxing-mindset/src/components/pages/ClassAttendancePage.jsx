import '../styling/attendance.css';
import { useState } from 'react';
import Button from '../layout/Button';

const ClassAttendancePage = () => {

    const [classes, setClasses] = useState([
        { name: "Boxing Basics (Adults)", date: "2025-11-24" },
        { name: "Advanced Boxing (Adults)", date: "2025-11-25" }
    ]);

    const [newClass, setNewClass] = useState({ name: "", date: "" });
    const [editClass, setEditClass] = useState({ name: "", date: "" });
    const [editIndex, setEditIndex] = useState(null);

    // Add Class Function
    const handleAdd = () => {
        if (newClass.name && newClass.date) {
            setClasses([...classes, newClass]); // adds class to new class
            setNewClass({ name: "", date: "" }); // resets input field
        }
    };

    // Delete Class Function
    const handleDelete = (index) => {
        const updatedClasses = [...classes];
        updatedClasses.splice(index, 1);
        setClasses(updatedClasses);
    }

    // Edit Class Function
    const handleSaveEdit = (index) => {
        const updated = [...classes];
        updated[index] = editClass;
        setClasses(updated);
        setEditIndex(null);
        setEditClass({ name: "", date: "" });
    };

    return (
        <div className="attendance-container">
            <h2 className='attendance-header'>Class Attendance</h2>

            <span className='boxing-class-name'>
                <input
                    type="text"
                    placeholder='Enter Class Name'
                    value={newClass.name}
                    onChange={(e) => setNewClass({ ...newClass, name: e.target.value })}
                />

                <br />

                <input
                    type="date"
                    value={newClass.date}
                    onChange={(e) => setNewClass({ ...newClass, date: e.target.value })}
                />
            </span>

            <br />

            <Button
                label="Add Class"
                onClick={handleAdd}
                className="add-class-button"
            />

            <ul className="class-attendance-list">
                {classes.map((x, index) =>
                    <li key={index}>
                        {editIndex === index ? ( // if current class is edited, show edit mode : else show normal mode with edit and delete buttons
                            <>
                                <input
                                    type="text"
                                    value={editClass.name}
                                    onChange={(e) => setEditClass({
                                        ...editClass, name: e.target.value
                                    })}
                                />

                                <input
                                    type="date"
                                    value={editClass.date}
                                    onChange={(e) => setEditClass({
                                        ...editClass, date: e.target.value
                                    })}
                                />

                                <Button
                                    label="Save"
                                    onClick={() => handleSaveEdit(index)}
                                    className='save-button'
                                />
                            </>
                        ) : ( // else block (normal mode)
                            <>
                                {x.name} | {x.date}
                                <Button
                                    label="Edit"
                                    className="edit-button"
                                    onClick={() => {
                                        setEditIndex(index);
                                        setEditClass(x);
                                    }}
                                />

                                <Button
                                    label="Delete"
                                    onClick={() => handleDelete(index)}
                                    className="delete-button"
                                />
                            </>
                        )}
                    </li>
                )}
            </ul>

        </div >
    )
}

export default ClassAttendancePage;