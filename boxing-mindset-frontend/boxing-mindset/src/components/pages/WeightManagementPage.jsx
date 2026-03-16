import '../styling/weight.css'
import { useState, useEffect } from 'react';
import { getWeighInsForUser, createWeighIn, updateWeighIn, deleteWeighIn } from '../../api/weighins';
import Button from '../layout/Button';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine, ResponsiveContainer } from "recharts";

const mensWeightClasses = [
    { name: 'Bantamweight', max: 121 },
    { name: 'Lightweight', max: 132 },
    { name: 'Welterweight', max: 143 },
    { name: 'Light Middleweight', max: 154 },
    { name: 'Light Heavyweight', max: 176 },
    { name: 'Heavyweight', max: 198 },
    { name: 'Super Heavyweight', max: Infinity }
];

const womensWeightClasses = [
    { name: 'Flyweight', max: 112 },
    { name: 'Bantamweight', max: 119 },
    { name: 'Featherweight', max: 125 },
    { name: 'Lightweight', max: 132 },
    { name: 'Welterweight', max: 143 },
    { name: 'Light Middleweight', max: 154 },
    { name: 'Middleweight', max: 165 }
];

const WeightManagementPage = () => {
    // Form inputs
    const [currentWeight, setCurrentWeight] = useState('');
    const [gender, setGender] = useState('');
    const [targetWeightClass, setTargetWeightClass] = useState('');
    const [date, setDate] = useState('');
    const [notes, setNotes] = useState('');

    // App data
    const [history, setHistory] = useState([]);
    const [allUsersHistory, setAllUsersHistory] = useState([]);
    const [users, setUsers] = useState([]);
    const [latest, setLatest] = useState(null);
    const [currentUserId, setCurrentUserId] = useState("");

    // UI
    const [editingId, setEditingId] = useState(null);
    const [selectedUserId, setSelectedUserId] = useState("");
    const [role, setRole] = useState('user');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showAdminForm, setShowAdminForm] = useState(false);
    const [chartTarget, setChartTarget] = useState(null);

    // Decide which userId to use
    const userId = role === 'admin' ? selectedUserId : currentUserId;

    useEffect(() => {
        if (role !== 'admin')
            return;

        const fetchUsers = async () => {
            try {
                const res = await fetch('http://localhost:8080/api/users');
                const data = await res.json();

                setUsers(data);

            } catch (e) {
                setError(e.message);
            }
        };

        fetchUsers();
    }, [role]);

    useEffect(() => {
        if (role !== 'admin')
            return;

        const fetchWeights = async () => {
            try {
                const res = await fetch('http://localhost:8080/api/weigh-ins');
                const data = await res.json();

                setAllUsersHistory(data);
            } catch (e) {
                setError(e.message);
            }
        };

        fetchWeights();
    }, [role]);

    useEffect(() => {
        if (role === 'admin')
            return;

        if (!currentUserId)
            return;

        const fetchUserWeights = async () => {
            try {
                const data = await getWeighInsForUser(currentUserId);
                setHistory(data);

                if (data.length > 0) {
                    setLatest(data[0]);
                }
            } catch (e) {
                setError(e.message);
            }
        };

        fetchUserWeights();
    }, [currentUserId, role]);

    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => setSuccess(''), 5000);
            return () => clearTimeout(timer);
        }
    }, [success]);

    // Saves Target Weight Class Per User
    function saveUserTarget(userId, weightClass) {
        localStorage.setItem(`targetClass_${userId}`, weightClass);
    }

    // Load Target Weight When User Changes
    useEffect(() => {
        if (!userId) return;

        const stored = localStorage.getItem(`targetClass_${userId}`);

        if (stored) {
            setTargetWeightClass(stored);

            const classes =
                gender === "Men" ? mensWeightClasses : womensWeightClasses;

            const found = classes.find(weightClass => weightClass.name === stored);
            if (found) setChartTarget(found.max);
        }
    }, [userId]);

    const weightClasses = gender === 'Men' ? mensWeightClasses : gender === 'Women' ? womensWeightClasses : [];
    const selectedClass = weightClasses.find(x => x.name === targetWeightClass);

    let displayHistory = [];

    if (role === "admin") {
        displayHistory = allUsersHistory.filter(
            weightEntry => weightEntry.user.id === selectedUserId
        );
    } else {
        displayHistory = history;
    }

    const sortedHistory = [...displayHistory]
        .map(weightEntry => ({
            ...weightEntry,
            weight: Number(weightEntry.weight)
        }))
        .sort((a, b) => new Date(a.date) - new Date(b.date));

    const getStatus = () => {
        if (!currentWeight || !selectedClass)
            return '';
        if (selectedClass.max === Infinity) {
            return currentWeight > 198
                ? 'You qualify for Super Heavyweight!'
                : `You need to gain ${198 - currentWeight} lbs. to qualify.`;
        }
        const diff = currentWeight - selectedClass.max;
        if (diff > 0) return `You need to lose ${diff} lbs. to make ${targetWeightClass}.`;
        if (diff < 0) return `You are ${Math.abs(diff)} lbs. under ${targetWeightClass}.`;
        return 'You are right on target! Get some rest and get ready to box!';
    };

    // ---------------------
    // CREATE
    // ---------------------

    async function saveWeighIn(e) {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!userId)
            return setError("Please select a user.");
        if (!gender)
            return setError("Please select gender.");

        const lbs = Number(currentWeight);

        if (!lbs || lbs <= 0)
            return setError("Please enter a valid weight (lbs.).");
        if (!targetWeightClass)
            return setError("Please select a weight class.");
        if (!date)
            return setError("Please select a date.");

        const today = new Date().toLocaleDateString("en-CA");

        if (date > today) {
            return setError("Date cannot be in the future.");
        }

        try {
            const saved = await createWeighIn({
                userId,
                date: date || undefined,
                notes: notes || undefined,
                weight: lbs
            });
            setHistory(prev => [saved, ...prev]);
            setAllUsersHistory(prev => [saved, ...prev]);
            if (!latest || new Date(saved.date) >= new Date(latest.date)) setLatest(saved);
            setSuccess("Weight has been successfully recorded! 🥊");
            setGender('');
            setCurrentWeight('');
            setTargetWeightClass('');
            setDate('');
            setNotes('');

        } catch (e) {
            setError(e.message);
        }
    }

    // ---------------------
    // DELETE
    // ---------------------

    async function handleDelete(id) {

        const confirmDelete = window.confirm("Are you sure you want to delete this weigh-in?");
        if (!confirmDelete)
            return;

        try {
            await deleteWeighIn(id);

            setHistory(prev => {
                const updated = prev.filter(weight => weight.id !== id);

                if (updated.length > 0) {
                    const newest = [...updated].sort(
                        (a, b) => new Date(b.date) - new Date(a.date)
                    )[0];
                    setLatest(newest);
                } else {
                    setLatest(null);
                }

                return updated;
            });

            setAllUsersHistory(prev => prev.filter(weight => weight.id !== id));

            setSuccess("Weight deleted successfully!");

        } catch (e) {
            setError(e.message);
        }
    }

    const EditRow = ({ weightEntry, onSave, onCancel }) => {
        const [weight, setWeight] = useState(weightEntry.weight);
        const [date, setDate] = useState(weightEntry.date);
        const [notes, setNotes] = useState(weightEntry.notes || '');

        const today = new Date().toLocaleDateString("en-CA");


        return (
            <div className='edit-row'>
                <input
                    type="number"
                    value={weight}
                    onChange={e => setWeight(e.target.value)} />
                <input
                    type="date"
                    id="date"
                    value={date}
                    max={today}
                    onChange={e => setDate(e.target.value)} />
                <input
                    type="text"
                    value={notes}
                    onChange={e => setNotes(e.target.value)} />
                <button
                    className='save-edit-button'
                    onClick={() => onSave({ weight: Number(weight), date, notes })}>
                    Save
                </button>
                <button
                    className='cancel-edit-button'
                    onClick={onCancel}>
                    Cancel
                </button>
            </div>
        );
    };

    // ---------------------
    // UPDATE
    // ---------------------

    async function handleUpdate(id, updatedValues) {
        setEditingId(null);
        try {
            const updated = await updateWeighIn(id, updatedValues);

            setHistory(prev => prev.map(weight => (weight.id === id ? updated : weight)));

            setAllUsersHistory(prev => prev.map(weight => (weight.id === id ? updated : weight)));

            setSuccess("Weight successfully updated! 🥊");
        } catch (e) {
            setError(e.message);
        }
    }

    const showWeightForm =
        role !== 'admin' || (role === 'admin' && showAdminForm && selectedUserId);

    return (
        <div className="weight-container">
            <h2 className="weight-header">Weight Management Dashboard</h2>
            <div className="role-toggle">
                <label className="switch">
                    <input
                        type="checkbox"
                        checked={role === 'admin'}
                        onChange={(e) => setRole(e.target.checked ? 'admin' : 'user')}
                    />
                    <span className="slider round"></span>
                </label>
                <span className="role-label">{role === 'admin' ? 'Admin' : 'User'}</span>
            </div>
            {role === 'admin' ? (
                <div className="role-banner admin-banner">
                    👑 Admin Dashboard (All Users Visible)
                </div>
            ) : (
                <div className="role-banner user-banner">
                    👤 My Weight Tracker
                </div>
            )}

            {role === 'admin' && users.length > 0 && (
                <div className="user-selector">
                    <label>Demo User:</label>
                    <select
                        value={selectedUserId || ''}
                        onChange={(e) => setSelectedUserId(Number(e.target.value))}
                    >
                        <option value="" disabled>
                            -- Select a Demo User --
                        </option>
                        {users.map(user => (
                            <option key={user.id} value={user.id}>
                                {user.username || `User ${user.id}`}
                            </option>
                        ))}
                    </select>
                </div>
            )}
            {role !== 'admin' && (
                <div className="user-selector">
                    <label>Demo User:</label>
                    <select
                        value={currentUserId}
                        onChange={(e) => setCurrentUserId(Number(e.target.value))}
                    >
                        <option value="" disabled>
                            -- Select a Demo User --
                        </option>
                        <option value={1}>Tupac</option>
                        <option value={2}>Ali</option>
                        <option value={3}>Carol</option>
                    </select>
                </div>
            )}
            <div className='section'>
                {showWeightForm && (
                    <div className='form-card'>

                        <div className="weight-recording-form">
                            <label>Gender:</label>
                            <select value={gender} onChange={(e) => setGender(e.target.value)}>
                                <option value="">Select Gender</option>
                                <option value="Men">Men</option>
                                <option value="Women">Women</option>
                            </select>
                        </div>

                        <div className="weight-recording-form">
                            <label>Current Weight (lbs):</label>
                            <input type="number" value={currentWeight} onChange={e => setCurrentWeight(e.target.value)} placeholder="Enter your current weight (lbs.)" />
                        </div>

                        <div className="weight-recording-form">
                            <label>Target Weight Class: </label>
                            <select
                                value={targetWeightClass}
                                onChange={(e) => {
                                    const selected = e.target.value;
                                    setTargetWeightClass(selected);

                                    const found = weightClasses.find(c => c.name === selected);
                                    if (found) setChartTarget(found.max);

                                    saveUserTarget(userId, selected);
                                }}
                                disabled={!gender}>
                                <option value="">Select Class</option>
                                {weightClasses.map(x => <option key={x.name} value={x.name}>{x.name} {x.max !== Infinity ? `(<= ${x.max} lbs)` : '(> 198 lbs)'}</option>)}
                            </select>
                        </div>
                        <form
                            onSubmit={saveWeighIn}
                            className="weight-recording-form">
                            <div>
                                <label htmlFor="date">Date:</label>
                                <input type='date' id="date" value={date} onChange={e => setDate(e.target.value)} placeholder="Enter the date" />
                            </div>
                            <div>
                                <label htmlFor="notes">Notes:</label>
                                <input id="notes" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Type your notes here..." />
                            </div>
                            <Button type="submit" label="Save Weight" disabled={!currentWeight || Number(currentWeight) <= 0 || !date} className={"save-weight-button"} />
                            {success && <div className="success-message">{success}</div>}
                            {error && <div className="error-message">{error}</div>}
                        </form>
                    </div>
                )}
            </div>

            <div className="get-status">
                <br />
                {getStatus()}
            </div>

            <div className='section'>
                {sortedHistory.length > 0 && (
                    <div className="recharts-container">
                        <h3>Weight History & Progress</h3>
                        <ResponsiveContainer width="100%" height={350}>
                            <LineChart
                                data={sortedHistory}
                                margin={{ top: 20, right: 50, left: 20, bottom: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="date" />
                                <YAxis
                                    domain={['auto', 'auto']} allowDecimals />
                                <Tooltip
                                    formatter={(value) => `${value} lbs`}
                                    labelFormatter={(date) => `Date: ${date}`}
                                />
                                {chartTarget && chartTarget !== Infinity && (
                                    <ReferenceLine
                                        y={chartTarget}
                                        stroke="green"
                                        strokeWidth={3}
                                        strokeDasharray="6 6"
                                        label={{
                                            value: `${chartTarget}`,
                                            position: "right",
                                            fill: "green",
                                            fontSize: 14,
                                            fontWeight: "bold"
                                        }}
                                    />
                                )}
                                <Line
                                    type="monotone"
                                    dataKey="weight"
                                    stroke="#e63946"
                                    strokeWidth={3}
                                    dot={{ r: 4 }}
                                    activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                        {latest && (
                            <div className="latest-weight">
                                Latest Weight: <strong>{latest.weight} lbs</strong> on {latest.date}
                            </div>
                        )}
                    </div>

                )}
            </div>

            <div className='section'>
                <div className="weight-history table-wrapper">
                    {sortedHistory.length > 0 && (
                        <table>
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Weight</th>
                                    <th>Notes</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedHistory.map(weight => (
                                    <tr key={weight.id}>
                                        {editingId === weight.id ? (
                                            <td colSpan={4}>
                                                <EditRow
                                                    weightEntry={weight}
                                                    onSave={(updatedValues) => { handleUpdate(weight.id, updatedValues); setEditingId(null); }}
                                                    onCancel={() => setEditingId(null)}
                                                />
                                            </td>
                                        ) : (
                                            <>
                                                <td>{weight.date}</td>
                                                <td>{weight.weight} lbs</td>
                                                <td>{weight.notes || '-'}</td>
                                                <td>
                                                    <button className='update-button'
                                                        onClick={() => setEditingId(weight.id)}>
                                                        Edit
                                                    </button>
                                                    <button className='delete-button'
                                                        onClick={() => handleDelete(weight.id)}>
                                                        Delete
                                                    </button>
                                                </td>
                                            </>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                    {role === 'admin' && selectedUserId && (
                        <div>
                            <button
                                className="admin-add-weight-button"
                                onClick={() => setShowAdminForm(prev => !prev)}
                            >
                                ➕ Add Weight for This User
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WeightManagementPage;