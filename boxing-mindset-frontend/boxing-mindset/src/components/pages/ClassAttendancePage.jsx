import '../styling/attendance.css';
import { useState } from 'react';
import Button from '../layout/Button';

const ClassAttendancePage = () => {

    const [classes, setClasses] = useState([
        { name: "Boxing Basics (Adults)", date: "2025-11-24", attending: false },
        { name: "Advanced Boxing (Adults)", date: "2025-11-25", attending: false }
    ]);

    const [newClass, setNewClass] = useState({ name: "", date: "" });
    const [editClass, setEditClass] = useState({ name: "", date: "" });
    const [editIndex, setEditIndex] = useState(null);

    // Add Class Function
    const handleAdd = () => {
        if (newClass.name && newClass.date) {
            setClasses([...classes, { ...newClass, attending: false }]); // adds class to new class
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

    // Toggle Attendance
    const toggleAttendance = (index) => {
        const updated = [...classes];
        updated[index].attending = !updated[index].attending;
        setClasses(updated);
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

            <table className="class-attendance-table">
                <thead>
                    <tr>
                        <th>Class Name</th>
                        <th>Date</th>
                        <th>Attending?</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {classes.map((x, index) =>
                        <tr key={index} className='fade-in'>
                            {editIndex === index ? ( // if current class is edited, show edit mode : else show normal mode with edit and delete buttons
                                <>
                                    <td>
                                        <input
                                            type="text"
                                            value={editClass.name}
                                            onChange={(e) => setEditClass({
                                                ...editClass, name: e.target.value
                                            })}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="date"
                                            value={editClass.date}
                                            onChange={(e) => setEditClass({
                                                ...editClass, date: e.target.value
                                            })}
                                        />
                                    </td>
                                    <td>
                                        {editClass.attending ? "Yes" : "No"}
                                    </td>
                                    <td>
                                        <Button
                                            label="Save"
                                            onClick={() => handleSaveEdit(index)}
                                            className='save-button'
                                        />
                                    </td>
                                </>
                            ) : ( // else block (normal mode)
                                <>
                                    <td>{x.name}</td>
                                    <td>{x.date}</td>
                                    <td>{x.attending ? "✅ Yes" : "❌ No"}</td>
                                    <td>
                                        <Button
                                            label="Attend"
                                            className='attend-button'
                                            onClick={() =>
                                                toggleAttendance(index)
                                            }
                                        />
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
                                    </td>
                                </>
                            )}
                        </tr>
                    )}
                </tbody>
            </table>
        </div >
    )
}

export default ClassAttendancePage;