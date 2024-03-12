"use client";
import React, {useEffect, useState} from "react";
const {io} = require("socket.io-client");
import Square from "../components/Square";
import Swal from "sweetalert2";

const renderMultiDimensionArray = [
	[1, 2, 3],
	[4, 5, 6],
	[7, 8, 9],
];

const page = () => {
	//over all game state
	const [gameState, setGameState] = useState(renderMultiDimensionArray);
	//player state
	const [currentPlayer, setCurrentPlayer] = useState(`circle`);
	//final game state && check winner to reset game state
	const [finalStage, setFinalStage] = useState(false);
	//highlight Winner State
	const [highlightWinner, sethighlightWinner] = useState([]);
	//Play button state
	const [playOnline, setPlayOnline] = useState(false);
	//Online Button State for connection
	const [socket, setScoket] = useState();
	//set player name state
	const [playerName, setPlayerName] = useState(null);
	//set opponent name state
	const [opponentName, setOpponentName] = useState(null);
	//set playingAs state for toggling player turn
	const [turn, setTurn] = useState(null);

	//winner logic
	const checkWinner = () => {
		//winner logic for each row
		for (let row = 0; row < gameState.length; row++) {
			if (gameState[row][0] === gameState[row][1] && gameState[row][1] === gameState[row][2]) {
				sethighlightWinner([row * 3 + 0, row * 3 + 1, row * 3 + 2]);
				return gameState[row][0];
			}
		}
		//winner logic for each coloumn
		for (let col = 0; col < gameState.length; col++) {
			if (gameState[0][col] === gameState[1][col] && gameState[1][col] === gameState[2][col]) {
				sethighlightWinner([0 * 3 + col, 1 * 3 + col, 2 * 3 + col]);
				return gameState[0][col];
			}
		}

		if (gameState[0][0] === gameState[1][1] && gameState[1][1] === gameState[2][2]) {
			return gameState[0][0];
		}

		if (gameState[0][2] === gameState[1][1] && gameState[1][1] === gameState[2][0]) {
			return gameState[0][2];
		}

		const isDraw = gameState.flat().every((e) => {
			if (e === "circle" || e === "cross") return true;
		});

		if (isDraw) return "draw";

		return null;
	};

	useEffect(() => {
		const winner = checkWinner();
		if (winner) setFinalStage(winner);
	}, [gameState]);

	const inGamePlayerName = async () => {
		const response = await Swal.fire({
			title: "Enter your name",
			input: "text",
			showCancelButton: true,
			inputValidator: (value) => {
				if (!value) {
					return "You need to write something!";
				}
			},
		});

		return response;
	};

	//We listen for the server & client events.
	socket?.on("connect", () => {
		setPlayOnline(true);
	});

	socket?.on("OpponentNotFound", () => {
		setOpponentName(false);
	});

	socket?.on("OpponentFound", (data) => {
		setTurn(data.playingAs);
		setOpponentName(data.opponentName);
	});

	socket?.on("gameStateFromServerSide", (data) => {
		const id = data.state.id;
		setGameState((prevS) => {
			let newState = [...prevS];
			const rowIndex = Math.floor(id / 3);
			const colIndex = id % 3;
			newState[rowIndex][colIndex] = data.state.sign;
			return newState;
		});
		setCurrentPlayer(data.state.sign === "circle" ? "cross" : "circle");
	});

	socket?.on("opponentLeftMatchg", () => {
		setFinalStage("opponentLeftMatchg");
	});

	//handle Playonline button click
	const handlePlayOnlineClick = async () => {
		//wait for plyer to enter there name
		const nameResponse = await inGamePlayerName();

		if (nameResponse.dismiss) {
			console.log("please enter your name to play the game");
			return;
		} else if (nameResponse.isConfirmed) {
			console.log(` Hello ${nameResponse.value} your name isConfirmed`);
		}

		const userNameResponse = nameResponse.value;
		setPlayerName(userNameResponse);

		//connect to server
		const newSocket = io(`http://localhost:8000/`, {
			autoConnect: true,
		});

		newSocket?.emit("request_to_play", {
			playerName: userNameResponse,
		});

		setScoket(newSocket);
	};

	const handlePlayAgain = () => {
		location.reload();
	};

	if (!playOnline) {
		return (
			<main
				className="flex flex-col justify-center items-center
			mx-auto mx-w-[390] h-screen"
			>
				<button
					onClick={handlePlayOnlineClick}
					className="hover:bg-slate-200 bg-white text-black px-10 py-5 rounded-xl font-bold text-xl"
				>
					Play Online
				</button>
			</main>
		);
	}

	if (playOnline && !opponentName) {
		return (
			<p className="flex justify-center items-center h-screen">waiting for player 2....</p>
		);
	}

	return (
		<main
			className="flex flex-col justify-center items-center
		  mx-auto mx-w-[390] mt-[5vh]"
		>
			<div className="flex flex-col justify-center items-center overflow-hidden h-[80vh] gap-y-5">
				<div className="flex justify-between w-full py-5">
					<div
						className={`flex px-3 py-2
						text-black text-center items-center rounded-md ${
							currentPlayer === turn ? "bg-green-500" : "bg-white"
						}`}
					>
						{playerName}
					</div>
					<div
						className={`flex px-3 py-2
						text-black text-center items-center rounded-md ${
							currentPlayer !== turn ? "bg-green-500" : "bg-white"
						}`}
					>
						{opponentName}
					</div>
				</div>
				{/* Game Heading */}
				<div className="bg-blue-500 px-5 py-2 my-5 rounded-lg">
					<h1>Tic Tac Toe</h1>
				</div>
				<div className="grid grid-cols-3 gap-3">
					{gameState.map((arr, rowInx) =>
						arr.map((e, colInx) => (
							<Square
								id={rowInx * 3 + colInx}
								key={rowInx * 3 + colInx}
								highlightWinner={highlightWinner}
								finalStage={finalStage}
								currentPlayer={currentPlayer}
								setCurrentPlayer={setCurrentPlayer}
								gameState={gameState}
								setGameState={setGameState}
								socket={socket}
								currentElement={e}
								turn={turn}
							/>
						))
					)}
				</div>
			</div>
			{/* UI message */}
			{finalStage && finalStage !== "opponentLeftMatchg" && finalStage !== "draw" && (
				<div className=" h-[10vh] flex mt-[5vh]">
					<h3 className="font-bold text-2xl">{`${
						finalStage === turn ? "You" : finalStage
					} won the game`}</h3>
				</div>
			)}
			{finalStage && finalStage === "draw" && (
				<div className=" h-[10vh] flex mt-[5vh]">
					<h3 className="font-bold text-2xl">Match is Draw</h3>
				</div>
			)}
			{opponentName && !finalStage && (
				<div className=" h-[10vh] flex mt-[5vh]">
					<h5 className="font-bold text-2xl">{`You are playing against ${opponentName}`}</h5>
				</div>
			)}
			{finalStage === "opponentLeftMatchg" && finalStage && (
				<div className=" h-[10vh] flex mt-[5vh]">
					<h5 className="font-bold text-2xl">
						{`You has won the match, Opponent was disconnected`}
					</h5>
				</div>
			)}
			<button
				onClick={handlePlayAgain}
				className="bg-blue-500 text-white px-8 py-3 rounded-xl font-bold text-xl mt-5"
			>
				Play Again
			</button>
		</main>
	);
};

export default page;
