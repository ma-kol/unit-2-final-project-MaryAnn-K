import '../styling/timer.css'
import { useState, useEffect, useRef } from 'react';
import Button from '../layout/Button';

const IntervalTimerPage = () => {
    const [isRunning, setIsRunning] = useState(false);
    const [time, setTime] = useState(60);
    const intervalRef = useRef(null);
    const [round, setRound] = useState(1);
    const [isResting, setIsResting] = useState(false);

    const boxingTime = 60; // seconds
    const restingTime = 30;
    const totalRounds = 3;

    const startTimer = () => {
        if (!isRunning) {
            setIsRunning(true);
            intervalRef.current = setInterval(() => {
                setTime(value => value - 1);
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
    useEffect(() => {
        if (time === 0 && isRunning) {
            clearInterval(intervalRef.current);
            if (isResting) {
                if (round < totalRounds) {
                    setRound(roundNumber => roundNumber + 1);
                    setIsResting(false);
                    setTime(boxingTime);
                    startTimer();
                } else {
                    setIsRunning(false);
                }
            } else {
                setIsResting(true);
                setTime(restingTime);
                startTimer();
            }
        }
    }, [time, isRunning, isResting, round]);

    // unmounts and clears timer
    useEffect(() => {
        return () => clearInterval(intervalRef.current);
    }, []);

    return (
        <div className="timer-container">
            <h2 className="timer-header">Interval Timer</h2>
            <div className="timer">
                <p className="timer-title">{isResting ? '-REST-' : 'BOX!'}</p>
                <p>Time Remaining: {time} seconds</p>
                <p>Round: {round} / {totalRounds}</p>
                <Button label="Start" onClick={startTimer} className="start-button"/>
                <Button label="Stop" onClick={stopTimer} className="stop-button"/>
                <br />
                <Button label="Reset" onClick={startTimer} className="reset-button" type="reset"/>
            </div>
        </div>
    )
}
export default IntervalTimerPage;