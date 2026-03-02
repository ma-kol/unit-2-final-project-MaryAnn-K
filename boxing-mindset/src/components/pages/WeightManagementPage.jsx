import '../styling/weight.css'
import { useState, useEffect } from 'react';
import { getWeighInsForUser, getLatestWeighIn, createWeighIn } from '../../api/weighins';
import Button from '../layout/Button';

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

    // Loads from backend
    useEffect(() => {
        (async () => {
            try {
                const [history, latest] = await Promise.all([
                    getWeighInsForUser(USER_ID),
                    getLatestWeighIn(USER_ID)
                ]);
                setHistory(history || []);
                setLatest(latest || null);
            } catch (e) {
                setError(e.message);
            }
        })();
    }, []);


    const mensWeightClasses = [
        { name: 'Bantamweight', max: 121 },
        { name: 'Lightweight', max: 132 },
        { name: 'Welterweight', max: 143 },
        { name: 'Light Middleweight', max: 154 },
        { name: 'Light Heavyweight', max: 176 },
        { name: 'Heavyweight', max: 198 },
        { name: 'Super Heavyweight', max: Infinity } // 198+
    ]

    const womensWeightClasses = [
        { name: 'Flyweight', max: 112 },
        { name: 'Bantamweight', max: 119 },
        { name: 'Featherweight', max: 125 },
        { name: 'Lightweight', max: 132 },
        { name: 'Welterweight', max: 143 },
        { name: 'Light Middleweight', max: 154 },
        { name: 'Middleweight', max: 165 }
    ]

    const weightClasses = gender === 'Men' ? mensWeightClasses : gender === 'Women' ? womensWeightClasses : [];

    const selectedClass = weightClasses.find(x => x.name === targetWeightClass);

    const getStatus = () => {
        if (!currentWeight || !selectedClass)
            return '';
        if (selectedClass.max === Infinity) {
            return currentWeight > 198
                ? 'You qualify for Super Heavyweight!' : `You need to gain ${198 - currentWeight} lbs to qualify for Super Heavyweight.`;
        }

        const weightDifference = currentWeight - selectedClass.max;
        if (weightDifference > 0)
            return `You need to lose ${weightDifference} lbs. to make ${targetWeightClass}.`;
        if (weightDifference < 0)
            return `You are ${Math.abs(weightDifference)} lbs. under ${targetWeightClass}.`;
        if (weightDifference === 0)
            return 'You are right on target! Get some rest and get ready to box!';
    }

    async function saveWeighIn(e) {
        e.preventDefault()
        setError('')

        const lbs = Number(currentWeight)
        if (!lbs || lbs <= 0) {
            setError('Please enter a valid weight (lbs.).')
            return
        }
        try {
            const saved = await createWeighIn({
                userId: USER_ID,
                date: date || undefined,
                notes: notes || undefined,
                weight: lbs
            });

            setHistory(previous => [saved, ...previous]);
            if (!latest || new Date(saved.date) >= new Date(latest.date)) {
                setLatest(saved);
            }
            setDate('');
            setNotes('');
        } catch (e) {
            setError(e.message);
        }
    }

    return (
        <div className="weight-container">
            <h2 className="weight-header">Weight Management</h2>
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
                <input
                    type="number"
                    value={currentWeight}
                    onChange={(e) => setCurrentWeight((e.target.value))}
                    placeholder="Enter your current weight"
                />
            </div>

            <div className="target-weight-dropdown">
                <label>Target Weight Class: </label>
                <select
                    value={targetWeightClass}
                    onChange={(e) => setTargetWeightClass(e.target.value)}
                    disabled={!gender}
                >

                    <option value="">Select Class</option>
                    {weightClasses.map((x) => (
                        <option key={x.name} value={x.name}>
                            {x.name} {x.max !== Infinity ? `(<= ${x.max} lbs)` : '(> 198 lbs)'}
                        </option>
                    ))}
                </select>
            </div>
            <div className="get-status">
                <br />
                {getStatus()}
            </div>

            <form onSubmit={saveWeighIn} className="weight-recording-form">
                <div className="weighin-field">
                    <label htmlFor="notes">Notes:</label>
                    <input
                        id="notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Type your notes here..."
                    />
                </div>

                <div className="weighin-field">
                    <label htmlFor="date">Date (YYYY-MM-DD):</label>
                    <input
                        id="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        placeholder="Enter the date"
                    />
                </div>
                  <Button
                    type="submit"
                    label='Save Weight'
                    disabled={Number(currentWeight) <= 0 || Number.isNaN(Number(currentWeight))}
                />
            </form>

        </div>
    )
}

export default WeightManagementPage;