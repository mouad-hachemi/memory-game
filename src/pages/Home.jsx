import "../styles/Home.css"
import { useRef, useState } from "react";

const Home = () => {
    const availableGames = useRef({
        gameOne: {
            name: "Arrow Dance",
            url: "/game-one",
        },
        gameTwo: {
            name: "Find Pairs",
            url: "/game-two",
        }
    });
    const [targetGame, setTargetGame] = useState(
        JSON.parse(localStorage.getItem("selected-game")) || availableGames.current.gameOne
    );

    return (
        <>
            <div id="home" className='container'>
                <h1>Welcome here!</h1>
                <h2>Selected game: {targetGame.name}</h2>
                <div className="actions-wrapper">
                    <button onClick={() => {
                        window.location.href = targetGame.url;
                    }}>
                        Start Game
                    </button>
                    <button onClick={() => {
                        if (targetGame.name == availableGames.current.gameOne.name) {
                            setTargetGame(availableGames.current.gameTwo);
                            localStorage.setItem("selected-game", JSON.stringify(availableGames.current.gameTwo));
                        } else {
                            setTargetGame(availableGames.current.gameOne);
                            localStorage.setItem("selected-game", JSON.stringify(availableGames.current.gameOne));
                        }
                    }}>Change Game</button>
                </div>
            </div>
        </>
    );
}

export default Home;