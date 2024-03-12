import React, {useState} from "react";

const Square = ({
	id,
	setGameState,
	gameState,
	currentElement,
	socket,
	setCurrentPlayer,
	currentPlayer,
	finalStage,
	highlightWinner,
	turn,
}) => {
	const [icon, setIcon] = useState(null);

	const circleSvg = (
		<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
			<g id="SVGRepo_bgCarrier"></g>
			<g id="SVGRepo_tracerCarrier"></g>
			<g id="SVGRepo_iconCarrier">
				<path
					d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
					stroke="#ffffff"
				></path>
			</g>
		</svg>
	);

	const crossSvg = (
		<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
			<g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
			<g id="SVGRepo_tracerCarrier"></g>
			<g id="SVGRepo_iconCarrier">
				<path d="M19 5L5 19M5.00001 5L19 19" stroke="#fff"></path>
			</g>
		</svg>
	);

	//handle click on square box
	const handleBox = () => {
		if (turn !== currentPlayer) return;
		if (finalStage) {
			return;
		}

		if (!icon) {
			if (currentPlayer === "circle") {
				setIcon(circleSvg);
			} else {
				setIcon(crossSvg);
			}

			const myCurrentPlayer = currentPlayer;
			socket.emit("gameStateFromClientSide", {
				state: {
					id,
					sign: myCurrentPlayer,
				},
			});
			//checking the current player and swtiching between them
			setCurrentPlayer(currentPlayer === "circle" ? "cross" : "circle");

			setGameState((prevS) => {
				let newState = [...prevS];
				const rowIndex = Math.floor(id / 3);
				const colIndex = id % 3;
				newState[rowIndex][colIndex] = myCurrentPlayer;
				return newState;
			});
		}
	};

	return (
		<div
			onClick={handleBox}
			className={`bg-blue-500 size-24 md:size-44
			${currentPlayer !== turn ? "cursor-not-allowed" : ""}
			${!finalStage ? `cursor-pointer` : ` cursor-not-allowed`}
			${finalStage && finalStage !== turn ? `bg-slate-500` : ``} 
			${highlightWinner.includes(id) ? `bg-green-500` : ``}`}
		>
			{currentElement === "circle" ? circleSvg : currentElement === "cross" ? crossSvg : icon}
		</div>
	);
};

export default Square;
