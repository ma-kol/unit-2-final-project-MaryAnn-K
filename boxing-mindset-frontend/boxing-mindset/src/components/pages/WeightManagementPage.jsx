import '../styling/weight.css'
import { useState, useEffect } from 'react';
import { getWeighInsForUser, getLatestWeighIn, createWeighIn, updateWeighIn, deleteWeighIn } from '../../api/weighins';
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
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [role, setRole] = useState('user');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Decide which userId to use
    const userId = role === 'admin' ? selectedUserId : currentUserId;

    useEffect(() => {
        if (role !== 'admin') return;

        const fetchUsers = async () => {
            try {
                const res = await fetch('http://localhost:8080/api/users');
                const data = await res.json();

                setUsers(data);

                if (!selectedUserId && data.length > 0) {
                    setSelectedUserId(data[0].id);
                }
            } catch (e) {
                setError(e.message);
            }
        };

        fetchUsers();
    }, [role]);

    useEffect(() => {
        if (role !== 'admin') return;

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
    }, [role, selectedUserId]);

    useEffect(() => {
        if (role === 'admin') return;

        if (!currentUserId) return;

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

    const weightClasses = gender === 'Men' ? mensWeightClasses : gender === 'Women' ? womensWeightClasses : [];
    const selectedClass = weightClasses.find(x => x.name === targetWeightClass);

    const displayHistory = (() => {
        const list = role === 'admin'
            ? allUsersHistory.filter(entry => entry.user.id === selectedUserId)
            : history;
        return list.map(entry => ({ ...entry, userId: entry.user?.id || entry.userId }));
    })();

    const sortedHistory = [...displayHistory].sort((a, b) => new Date(a.date) - new Date(b.date));

    const getStatus = () => {
        if (!currentWeight || !selectedClass) return '';
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

    async function saveWeighIn(e) {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!userId) return setError('Please select a user.');

        const lbs = Number(currentWeight);
        if (!lbs || lbs <= 0) return setError('Please enter a valid weight (lbs.).');

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
            setDate(''); setNotes(''); setCurrentWeight('');
        } catch (e) {
            setError(e.message);
        }
    }

    async function handleDelete(id) {
        try {
            await deleteWeighIn(id);

            setHistory(prev => prev.filter(weight => weight.id !== id));
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

        return (
            <>
                <input type="number" value={weight} onChange={e => setWeight(e.target.value)} />
                <input type="date" value={date} onChange={e => setDate(e.target.value)} />
                <input type="text" value={notes} onChange={e => setNotes(e.target.value)} />
                <button onClick={() => onSave({ weight: Number(weight), date, notes })}>Save</button>
                <button onClick={onCancel}>Cancel</button>
            </>
        );
    };

    async function handleUpdate(id, updatedValues) {
        try {
            const updated = await updateWeighIn(id, updatedValues);

            setHistory(prev => prev.map(weight => (weight.id === id ? updated : weight)));

            setAllUsersHistory(prev => prev.map(weight => (weight.id === id ? updated : weight)));

            setSuccess("Weight updated!");
        } catch (e) {
            setError(e.message);
        }
    }

    return (
        <div className="weight-container">
            <h2 className="weight-header">Weight Management</h2>

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

            {role !== 'admin' && (
                <div className="demo-user-selector">
                    <label>Demo User: </label>
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

            <div className="dropdown-form">
                <label>Gender:</label>
                <select value={gender} onChange={(e) => setGender(e.target.value)}>
                    <option value="">Select Gender</option>
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                </select>
            </div>

            <div className="dropdown-form">
                <label>Current Weight(lbs):</label>
                <input type="number" value={currentWeight} onChange={e => setCurrentWeight(e.target.value)} placeholder="Enter your current weight" />
            </div>

            <div className="dropdown-form">
                <label>Target Weight Class: </label>
                <select value={targetWeightClass} onChange={(e) => setTargetWeightClass(e.target.value)} disabled={!gender}>
                    <option value="">Select Class</option>
                    {weightClasses.map(x => <option key={x.name} value={x.name}>{x.name} {x.max !== Infinity ? `(<= ${x.max} lbs)` : '(> 198 lbs)'}</option>)}
                </select>
            </div>

            <div className="get-status">
                <br />
                {getStatus()}
            </div>

            {
                role === 'admin' && (
                    <div>
                        Saving weight for user: {selectedUserId}
                    </div>
                )
            }

            <form onSubmit={saveWeighIn} className="weight-recording-form">
                <div className="weighin-field">
                    <label htmlFor="date">Date:</label>
                    <input type='date' id="date" value={date} onChange={e => setDate(e.target.value)} placeholder="Enter the date" />
                </div>
                <div className="weighin-field">
                    <label htmlFor="notes">Notes:</label>
                    <input id="notes" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Type your notes here..." />
                </div>
                <Button type="submit" label="Save Weight" disabled={!currentWeight || Number(currentWeight) <= 0} className={"save-weight-button"} />
                {success && <div className="success-message">{success}</div>}
                {error && <div className="error-message">{error}</div>}
            </form>

            {/* Admin user selector */}
            {role === 'admin' && users.length > 0 && (
                <div className="admin-user-selector">
                    <label>Select User: </label>
                    <select
                        value={selectedUserId || ''}
                        onChange={(e) => setSelectedUserId(Number(e.target.value))}
                    >
                        <option value="" disabled>Select a user</option>
                        {users.map(user => (
                            <option key={user.id} value={user.id}>
                                {user.username || `User ${user.id}`}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {sortedHistory.length > 0 && selectedClass && (
                <div className="recharts-container">
                    <h3>Weight History & Progress</h3>
                    <ResponsiveContainer width="100%" height={350}>
                        <LineChart data={sortedHistory}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip labelFormatter={(date) => date} />
                            {selectedClass.max !== Infinity && (
                                <ReferenceLine y={selectedClass.max} stroke="green" strokeDasharray="5 5" label="Target" />
                            )}
                            <Line type="monotone" dataKey="weight" stroke="#e63946" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            )}

            <div className="weight-history">
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
                                                <button className='update-button' onClick={() => setEditingId(weight.id)}>Edit</button>
                                                <button className='delete-button' onClick={() => handleDelete(weight.id)}>Delete</button>
                                            </td>
                                        </>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default WeightManagementPage;