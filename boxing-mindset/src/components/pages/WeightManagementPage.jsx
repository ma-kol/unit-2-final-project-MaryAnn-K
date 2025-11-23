import '../styling/weight.css'
import { useState } from 'react';

const WeightManagementPage = () => {
    const [currentWeight, setCurrentWeight] = useState('');
    const [gender, setGender] = useState('');
    const [targetWeightClass, setTargetWeightClass] = useState('');

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
        </div>
    )
}

export default WeightManagementPage;