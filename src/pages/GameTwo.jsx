import { useCallback, useEffect, useRef } from "react";
import "../styles/GameTwo.css";
import { useState } from "react";

const GameTwo = () => {
    const [activeCards, setActiveCards] = useState([]);
    const [foundPairs, setFoundPairs] = useState([]);
    const [grid, setGrid] = useState({});
    const [time, setTime] = useState(0);
    const [gameStarted, setGameStarted] = useState(false);
    const [gameLevel, setGameLevel] = useState(0);
    const [scores, setScores] = useState(JSON.parse(localStorage.getItem("scores")) || []);
    const levelsRef = useRef({
        0: 4,
        1: 16,
        2: 36,
        3: 64,
        4: 100
    });
    const timoutFiredRef = useRef(false);
    const startTimeRef = useRef(0);
    const timerRef = useRef(0);
    const missesRef = useRef(0);
    const oneShotsRef = useRef(0);
    const scoreSavedRef = useRef(false);

    const handleClick = useCallback((event) => {
        if (!gameStarted) return;
        if (foundPairs.find((element) => element == event.currentTarget.id)) return;
        if (activeCards.find((element) => element == event.currentTarget.id)) return;

        const id = event.currentTarget.id;
        setActiveCards((prev) => {
            const newActives = prev.concat([id]);
            timoutFiredRef.current = true;
            setTimeout(() => {
                if (newActives.length > 1 && timoutFiredRef.current) {
                    const [firstCardId, secondCardId] = newActives;

                    const firstCardValue = grid[firstCardId].value;
                    const secondCardValue = grid[secondCardId].value;

                    const wasOpen = grid[firstCardId].opened || grid[secondCardId].opened;
                    const noOneOpen = !grid[firstCardId].opened && !grid[secondCardId].opened;

                    if (firstCardValue == secondCardValue) {
                        if (noOneOpen) oneShotsRef.current += 1
                        setFoundPairs((prev) => {
                            const newPairs = prev.concat(newActives);
                            if (newPairs.length == levelsRef.current[gameLevel] && !scoreSavedRef.current) {
                                scoreSavedRef.current = true;
                                setScores((prev) => {
                                    const newScore = [...prev];
                                    const levels = {
                                        0: "New Born",
                                        1: "Child",
                                        2: "Secondary Student",
                                        3: "Graduate",
                                        4: "Einstein",
                                    }

                                    newScore.push({
                                        misses: missesRef.current,
                                        oneShots: oneShotsRef.current,
                                        time,
                                        level: levels[gameLevel],
                                    });
                                    return newScore;
                                })
                                resetGame(2000);
                            };
                            return newPairs;
                        });
                    } else {
                        if (wasOpen) {
                            missesRef.current += 1;
                        }
                        setGrid((prevGrid) => {
                            const newGrid = { ...prevGrid };
                            newGrid[firstCardId] = { ...newGrid[firstCardId], opened: true };
                            newGrid[secondCardId] = { ...newGrid[secondCardId], opened: true };
                            return newGrid;
                        });
                    }
                    timoutFiredRef.current = false;
                    setActiveCards([]);
                }
            }, 500);
            return newActives;
        });
    }, [gameStarted, grid, activeCards, foundPairs]);

    const startTimer = useCallback(() => {
        const currentTime = Math.floor(Date.now() / 1000);
        const timeDiff = currentTime - startTimeRef.current;
        setTime(timeDiff);
        timerRef.current = setTimeout(startTimer, 1000)
    }, []);

    const resetGame = useCallback((delay = 0) => {
        setActiveCards([]);
        setGameStarted(false);
        setTimeout(() => {
            setFoundPairs([]);
            setTime(0);
            scoreSavedRef.current = false;
            setTimeout(() => {
                setGrid(generateGrid());
                missesRef.current = 0;
                oneShotsRef.current = 0;
            }, 200);
        }, delay);
    }, []);

    const getGridStyle = () => ({
        gridTemplateColumns: `repeat(${Math.sqrt(levelsRef.current[gameLevel])}, 36px)`,
        gridTemplateRows: `repeat(${Math.sqrt(levelsRef.current[gameLevel])}, 36px)`,
    });

    const getCardClass = (id) => {
        if (foundPairs.find((element) => element == id)) {
            return "card found";
        }
        else if (activeCards.find((element) => element == id)) {
            return "card active";
        } else {
            return "card"
        }
    }

    useEffect(() => {
        setGrid(generateGrid());
    }, [gameLevel]);

    useEffect(() => {
        if (gameStarted) {
            startTimeRef.current = Math.floor(Date.now() / 1000);
            timerRef.current = setTimeout(() => {
                startTimer();
            }, 1000);
        }

        return () => {
            clearTimeout(timerRef.current);
        }
    }, [gameStarted]);

    useEffect(() => {
        window.localStorage.setItem("scores", JSON.stringify(scores));
    }, [scores]);


    const shuffle = (array) => {
        for (let i = array.length - 1; i >= 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    };

    return (
        <>
            <div id="game-two" className="container">
                <h1>Find Pairs</h1>
                <h2 className="clock">{formatTime(time).join(':')}</h2>
                <div className="current-score">
                    <p>{missesRef.current} ❌</p>
                    <p>{oneShotsRef.current} 🎯</p>
                </div>
                <div className="cards" style={getGridStyle(levelsRef.current[gameLevel])}>
                    {Object.keys(grid).map((el) =>
                        <div
                            id={el}
                            key={el}
                            className={getCardClass(el)}
                            onClick={handleClick}
                        >
                            <div className="content">
                                <div className="front"><p>?</p></div>
                                <div className="back"><p>{grid[el].value}</p></div>
                            </div>
                        </div>
                    )}
                </div>
                {<div className="actions">
                    <button
                        className="start"
                        onClick={
                            () => {
                                if (gameStarted) {
                                    resetGame();
                                } else setGameStarted(true);
                                // setGameFinished((prev) => !prev);
                            }}>
                        {gameStarted ? "Stop Game" : "Start Game"}
                    </button>
                    <select
                        name="game-level"
                        id="game-level"
                        disabled={gameStarted}
                        value={gameLevel}
                        onChange={(e) => setGameLevel(e.target.value)}
                    >
                        <option value="0">New Born</option>
                        <option value="1">Child</option>
                        <option value="2">Secondary Student</option>
                        <option value="3">Graduate</option>
                        <option value="4">Einstein</option>
                    </select>
                </div>}
                <div className="score-board">
                    {scores.map((el, i) =>
                        <div className="score" key={i}>
                            <p>{el.misses} ❌</p>
                            <div>
                                <p className="clock">{formatTime(el.time).join(":")} ⏳</p>
                                <p className="level">{el.level}</p>
                            </div>
                            <p> {el.oneShots} 🎯</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );

    function generateGrid() {
        let halfGrid = [];
        for (let i = 0; i < levelsRef.current[gameLevel] / 2; i++) {
            let randNumb = Math.floor(Math.random() * 100);
            while (halfGrid.find((element) => element == randNumb)) {
                randNumb = Math.floor(Math.random() * 100);
            }
            halfGrid.push(randNumb);
        }

        let fullGrid = [...halfGrid, ...halfGrid];
        fullGrid = shuffle(fullGrid);
        let gridObj = {};
        fullGrid.forEach((value, index) => {
            gridObj[`card${index}`] = { value, opened: false };
        });
        return gridObj;
    }

    function formatTime(fullTime) {
        const hours = Math.floor(fullTime / 3600);
        const minutes = Math.floor((fullTime % 3600) / 60);
        const seconds = Math.floor((fullTime % 3600) - (60 * minutes));
        return [`${hours}`.padStart(2, '0'), `${minutes}`.padStart(2, '0'), `${seconds}`.padStart(2, '0')];
    }
}

export default GameTwo;
