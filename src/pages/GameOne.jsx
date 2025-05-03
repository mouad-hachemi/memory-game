/**
 * Arrow Dance Game: there will be a serie of arrow moves and the player will have to remember and repeat those moves.
 */

import "../styles/GameOne.css";
import { ArrowRight, ArrowLeft, ArrowUp, ArrowDown, IconoirProvider } from "iconoir-react";
import { useCallback, useEffect, useRef, useState } from "react";

const GameOne = () => {
    const [wave, setWave] = useState(1);
    const [highScore, setHighScore] = useState(JSON.parse(localStorage.getItem("highscore")) || 0);
    const [moves, setMoves] = useState(shuffleMoves(wave));
    const [message, setMessage] = useState("Press start (space).");
    const [canPress, setCanPress] = useState(false);
    const [pressedMoves, setPressedMoves] = useState([]);
    const [activeArrow, setActiveArrow] = useState(null);
    const [gameIsOn, setGameIsOn] = useState(false);
    const [animationDelay, setAnimationDelay] = useState(1.2);

    const supportingMessages = useRef(["Cool 🤳", "Good job 👍", "You're a genius 🪬", "Dancer Dancer 🪩"]);

    const resetState = useCallback(() => {
        setMoves(shuffleMoves(1));
        setPressedMoves([]);
        setCanPress(false);
        setGameIsOn(false)
        setMessage("Press space to start.");
        setActiveArrow(null);
    }, []);

    const nextWave = useCallback(() => {
        setWave((prevWave) => {
            const newWave = prevWave + 1;
            if (newWave % 10 == 0) {
                setAnimationDelay((prevDelay) => {
                    const newDelay = prevDelay - 0.05; // every 10 waves, make the animation speed shorter.
                    return newDelay;
                });
            }
            setHighScore((prev) => Math.max(prev, prevWave));
            setMoves(shuffleMoves(newWave));
            setPressedMoves([]);
            setCanPress(false);
            return newWave;
        });
    }, []);

    const handleMobileControls = useCallback((event) => {
        if (!gameIsOn) return;

        if (!canPress) return;

        const arrows = {
            right: "right",
            left: "left",
            up: "up",
            down: "down",
        }

        const arrow = arrows[event.currentTarget.id];

        if (!arrow) return;

        if (moves[pressedMoves.length] === arrow) {
            const randomSupportingMessage = supportingMessages.current[
                Math.floor(Math.random() * supportingMessages.current.length)
            ]
            setMessage(randomSupportingMessage);
            setPressedMoves((prev) => [...prev, arrow]);
            if (moves.length === pressedMoves.length + 1) {
                setMessage("Finished! next dance is coming be ready! 🪖");
                setTimeout(nextWave, 1000);
            }
        } else {
            setMessage("Oops! you fell. again, on your feet! 🐥");
            setWave(1);
            setTimeout(resetState, 1000);
        }

    }, [gameIsOn, canPress, moves, pressedMoves])

    const handleKeyUp = useCallback((event) => {
        if (!gameIsOn) {
            if (event.code == "Space") {
                setGameIsOn(true);
            }

            return;
        }

        if (!canPress) return;

        const arrows = {
            ArrowRight: "right",
            ArrowLeft: "left",
            ArrowUp: "up",
            ArrowDown: "down",
        }

        const arrow = arrows[event.code];

        if (!arrow) return;

        if (moves[pressedMoves.length] === arrow) {
            const randomSupportingMessage = supportingMessages.current[
                Math.floor(Math.random() * supportingMessages.current.length)
            ]
            setMessage(randomSupportingMessage);
            setPressedMoves((prev) => [...prev, arrow]);
            if (moves.length === pressedMoves.length + 1) {
                setMessage("Finished! next dance is coming be ready! 🪖");
                setTimeout(nextWave, 1000);
            }
        } else {
            setMessage("Oops! you fell. again, on your feet! 🐥");
            setWave(1);
            setTimeout(resetState, 1000);
        }
    }, [gameIsOn, canPress, moves, pressedMoves]);

    useEffect(() => {
        window.addEventListener("keyup", handleKeyUp);
        return () => {
            window.removeEventListener("keyup", handleKeyUp);
        }
    }, [handleKeyUp]);

    useEffect(() => {
        if (gameIsOn) animateArrows();
    }, [moves, gameIsOn]);

    useEffect(() => {
        localStorage.setItem("highscore", JSON.stringify(highScore));
    }, [highScore]);

    const getElementStyle = (arrow) => ({
        backgroundColor: arrow == activeArrow ? "#333" : "white",
        color: arrow == activeArrow ? "white" : "#333",
        transition: `all ${animationDelay}s ease-in-out`,
    });

    return (
        <IconoirProvider
            iconProps={{
                width: "1rem",
                height: "1rem",
            }}
        >
            <div id="game-one" className="container">
                <h1>Remember the order of arrows.<br /> Current Dance: {wave}</h1>
                <div className="arrows">
                    <div className="arrow" id="right" style={getElementStyle("right")}>
                        <ArrowRight />
                    </div>
                    <div className="arrow" id="left" style={getElementStyle("left")}>
                        <ArrowLeft />
                    </div>
                    <div className="arrow" id="up" style={getElementStyle("up")}>
                        <ArrowUp />
                    </div>
                    <div className="arrow" id="down" style={getElementStyle("down")}>
                        <ArrowDown />
                    </div>
                </div>
                <p>{message}</p>
                <p>The most wonderful dance you reached: {highScore} 👞</p>
                <div className="mobile-controls">
                    <button
                        id="start"
                        onClick={() => setGameIsOn(true)}
                    >
                        Start Game
                    </button>
                    <div className="arrow-buttons">
                        <div className="arrow" id="right" onClick={handleMobileControls}>
                            <ArrowRight />
                        </div>
                        <div className="arrow" id="left" onClick={handleMobileControls}>
                            <ArrowLeft />
                        </div>
                        <div className="arrow" id="up" onClick={handleMobileControls}>
                            <ArrowUp />
                        </div>
                        <div className="arrow" id="down" onClick={handleMobileControls}>
                            <ArrowDown />
                        </div>
                    </div>
                </div>
            </div>
        </ IconoirProvider>
    );

    function shuffleMoves(currentWave) {
        let possibleMoves = ["right", "left", "up", "down"];
        // Maximum moves is 6.
        return Array.from({ length: Math.min(currentWave + 1, 6) }, () => {
            return possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
        });
    }

    function animateArrows() {
        moves.forEach((move, index) => {
            setTimeout(() => {
                setActiveArrow(move);
            }, index * 2 * animationDelay * 1000);

            setTimeout(() => {
                setActiveArrow(null);
            }, (index * 2 + 1) * animationDelay * 1000);

            if (index == moves.length - 1) {
                setTimeout(() => {
                    setMessage("Now move your legs 🥁");
                    setCanPress(true);
                }, (index * 2 + 2) * animationDelay * 1000);
            }
        });
    }
}

export default GameOne;