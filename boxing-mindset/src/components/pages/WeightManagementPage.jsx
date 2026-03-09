import '../styling/weight.css'
import { useState, useEffect } from 'react';
import { getWeighInsForUser, getLatestWeighIn, createWeighIn, updateWeighIn, deleteWeighIn } from '../../api/weighins';
import Button from '../layout/Button';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine, ResponsiveContainer } from "recharts";

// Hardcoded for testing, change later
const USER_ID = 1;

const WeightManagementPage = () => {
    const [currentWeight, setCurrentWeight] = useState('');
    const [gender, setGender] = useState('');
    const [targetWeightClass, setTargetWeightClass] = useState('');
    const [history, setHistory] = useState([]);
    const [latest, setLatest] = useState(null);
    const [notes, setNotes] = useState('');
    const [date, setDate] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [role, setRole] = useState('user');
    const [allUsersHistory, setAllUsersHistory] = useState([]);

    // Loads from backend
    useEffect(() => {
        if (!USER_ID) return;

        (async () => {
            try {
                if (role === 'admin') {
                    // Admin sees everyone’s weights
                    const response = await fetch('http://localhost:8080/api/weigh-ins');
                    const data = await response.json();
                    setAllUsersHistory(data);
                } else {
                    const [history, latest] = await Promise.all([
                        getWeighInsForUser(USER_ID),
                        getLatestWeighIn(USER_ID)
                    ]);
                    setHistory(history || []);
                    setLatest(latest || null);
                }
            } catch (e) {
                setError(e.message);
            }
        })();
    }, [role]);

    // Hides success message after 5 seconds
    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => setSuccess(''), 5000);
            return () => clearTimeout(timer);
        }
    }, [success]);

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

    const weightClasses = gender === 'Men' ? mensWeightClasses : gender === 'Women' ? womensWeightClasses : [];
    const selectedClass = weightClasses.find(x => x.name === targetWeightClass);
    // Sort weights for Recharts
    const displayHistory = role === 'admin' ? allUsersHistory : history;
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

        const lbs = Number(currentWeight);
        if (!lbs || lbs <= 0) return setError('Please enter a valid weight (lbs.).');

        try {
            const saved = await createWeighIn({
                userId: USER_ID,
                date: date || undefined,
                notes: notes || undefined,
                weight: lbs
            });
            setHistory(prev => [saved, ...prev]);
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

            setSuccess("Weight deleted successfully!");
        } catch (e) {
            setError(e.message);
        }
    }

    async function handleUpdate(id) {
        try {
            const updated = await updateWeighIn(id, {
                weight: Number(currentWeight),
                date: date,
                notes: notes
            });

            setHistory(prev =>
                prev.map(weight => (weight.id === id ? updated : weight))
            );

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

            <div className="gender-dropdown">
                <label>Gender:</label>
                <select value={gender} onChange={(e) => setGender(e.target.value)}>
                    <option value="">Select Gender</option>
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                </select>
            </div>

            <div className="current-weight-dropdown">
                <label>Current Weight(lbs):</label>
                <input type="number" value={currentWeight} onChange={e => setCurrentWeight(e.target.value)} placeholder="Enter your current weight" />
            </div>

            <div className="target-weight-dropdown">
                <label>Target Weight Class: </label>
                <select value={targetWeightClass} onChange={e => setTargetWeightClass(e.target.value)} disabled={!gender}>
                    <option value="">Select Class</option>
                    {weightClasses.map(x => <option key={x.name} value={x.name}>{x.name} {x.max !== Infinity ? `(<= ${x.max} lbs)` : '(> 198 lbs)'}</option>)}
                </select>
            </div>

            <div className="get-status">
                <br />
                {getStatus()}
            </div>

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

            {role === 'admin' && (
                <div className="admin-panel">
                    <h3>Admin Panel</h3>
                    <p>This is the admin view for demonstration purposes. Plan to expand in next phase.</p>
                </div>
            )}

            {sortedHistory.length > 0 && selectedClass && (
                <div className="recharts-container">
                    <h3>Weight History & Progress</h3>
                    <ResponsiveContainer width="100%" height={350}>
                        <LineChart data={sortedHistory}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" tickFormatter={date => new Date(date).toLocaleDateString()} />
                            <YAxis />
                            <Tooltip labelFormatter={date => new Date(date).toLocaleDateString()} />
                            {selectedClass.max !== Infinity && <ReferenceLine y={selectedClass.max} stroke="green" strokeDasharray="5 5" label="Target" />}
                            <Line type="monotone" dataKey="weight" stroke="#e63946" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            )}

            <h3 className='weight-recording-form'>Edit Weights</h3>
            {
                history.map(weight => (
                    <div className='weight-recording-form' key={weight.id}>
                        {new Date(weight.date).toLocaleDateString()} - {weight.weight} lbs

                        <button onClick={() => handleUpdate(weight.id)}>
                            Update
                        </button>

                        <button onClick={() => handleDelete(weight.id)}>
                            Delete
                        </button>
                    </div>
                ))
            }
        </div>
    );
};

export default WeightManagementPage;