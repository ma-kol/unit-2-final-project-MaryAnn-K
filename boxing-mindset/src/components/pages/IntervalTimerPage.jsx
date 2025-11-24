import '../styling/timer.css'
import { useState, useEffect, useRef } from 'react';
import Button from '../layout/Button';
import FormField from '../child/FormField';

const IntervalTimerPage = () => {

    const [boxingTime, setBoxingTime] = useState(60);
    const [restingTime, setRestingTime] = useState(30);
    const [totalRounds, setTotalRounds] = useState(3);

    const [isRunning, setIsRunning] = useState(false);
    const [time, setTime] = useState(boxingTime);
    const intervalRef = useRef(null); // Stores interval ID
    const [round, setRound] = useState(1);
    const [isResting, setIsResting] = useState(false); // Boxing or resting

    const startTimer = () => {
        if (!isRunning) {
            setIsRunning(true);
            intervalRef.current = setInterval(() => {
                setTime(value => value - 1); // Decreases time every second
            }, 1000);
        }
    }

    const stopTimer = () => {
        clearInterval(intervalRef.current);
        setIsRunning(false);
    };

    const resetTimer = () => {
        clearInterval(intervalRef.current);
        setIsRunning(false);
        setTime(boxingTime);
        setRound(1);
        setIsResting(false);
    };

    // Updates time if boxingTime changes during 1st round
    useEffect(() => {
        if (!isResting && round === 1) {
            setTime(boxingTime);
        }
    }, [boxingTime, isResting, round]);

    useEffect(() => {
        if (time === 0 && isRunning) {
            clearInterval(intervalRef.current);
            setTimeout(() => {
                if (isResting) {
                    // If resting, go back to boxing
                    if (round < totalRounds) {
                        setRound(roundNumber => roundNumber + 1); // Next round
                        setIsResting(false); // Switch to boxing
                        setTime(boxingTime); // Resets boxing time
                        setIsRunning(true);
                    } else {
                        setIsRunning(false);
                    }
                } else {
                    // Finished boxing; boxing -> rest transition

                    setIsResting(true);
                    setTime(restingTime);
                    setIsRunning(true);
                }
            }, 1000);
        }
    }, [time, isRunning, isResting, round, boxingTime, restingTime, totalRounds]);

    // Restarts timer whenever time changes and IsRunning is true
    useEffect(() => {
        if (isRunning && time > 0) {
            clearInterval(intervalRef.current);
            intervalRef.current = setInterval(() => {
                setTime(time => time - 1);
            }, 1000);
        }
        return () => clearInterval(intervalRef.current);
    }, [isRunning, time]);

    // Unmounts and clears timer
    useEffect(() => {
        return () => clearInterval(intervalRef.current);
    }, [isRunning, time]);

    return (
        <div className="timer-container">
            <h2 className="timer-header">Interval Timer</h2>
            <div className="timer">
                <p className="timer-title">{isResting ? '- REST -' : 'BOX!'}</p>
                <p>{time} seconds</p>
                <p>Round: {round} / {totalRounds}</p>
                <div className='timer-user-input'>
                    <FormField
                        label="Boxing Time (sec):  "
                        type="number"
                        value={boxingTime}
                        onChange={(e) => setBoxingTime(e.target.value)}
                    />
                    <br />
                    <FormField
                        label="Rest Time (sec):  "
                        type="number"
                        value={restingTime}
                        onChange={(e) => setRestingTime(e.target.value)}
                    />
                    <br />
                    <FormField
                        label="Total Rounds  "
                        type="number"
                        value={totalRounds}
                        onChange={(e) => setTotalRounds(e.target.value)}
                    />
                </div>
                <Button label="Start" onClick={startTimer} className="start-button" />
                <Button label="Stop" onClick={stopTimer} className="stop-button" />
                <br />
                <Button label="Reset" onClick={resetTimer} className="reset-button" type="reset" />
            </div>
        </div>
    )
}
export default IntervalTimerPage;