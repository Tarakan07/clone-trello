import React, { useState } from "react";
import "./app.css";
import Board from "../board";

 type Board={
	id:number,
	title:string,
	fields:BoardField[]|[],
 }
type BoardField={
	id:number,
	title:string,
}

type ActiveBoard={
	move:{
		board:Board|null,
		field:BoardField|null,
	},
	receiving:{
		board:Board|null,
		field:BoardField|null,
	}
}

type DragParams={
	boardProps?:Board|null,
	field?:BoardField|null,
	e:React.DragEvent<HTMLDivElement>
}


const initialStateBoard:Board[]=[
	{
		id: 3,
		title: "Доска 3",
		fields: [
			// { id: 8, title: "Доска 3-3" },
			// { id: 7, title: "Доска 3-2" },
			// { id: 6, title: "Доска 3-1" },
		],
	},
	{
		id: 2,
		title: "Доска 2",
		fields: [
			{ id: 5, title: "доска 2-3" },
			{ id: 4, title: "Доска 2-2" },
			{ id: 3, title: "Доска 2-1" },
		],
	},
	{
		id: 1,
		title: "Доска 1",
		fields: [
			{ id: 2, title: "Доска 1-3" },
			{ id: 1, title: "Доска 1-2" },
			{ id: 0, title: "Доска 1-1" },
		],
	},
]

const App = () => {
	const [board, setBoard] = useState<Board[]>(initialStateBoard);
	const [active, setActive] = useState<ActiveBoard>({
		move: { board: null, field: null },
		receiving: { board: null, field: null },
	});
	const [inputValue, setInputValue] = useState<string>("");

	const createBoard = () => {
		const newBoard:Board = {
			id: board.length + 1,
			title: inputValue.length > 0 ? inputValue : "Без названия",
			fields: [],
		};

		setBoard([newBoard, ...board]);
		setInputValue("");
	};
	const sliceArray=({array,index,item=null})=>{
		return item?[...array.slice(0, index), ...array.slice(index + 1)]:
		[...array.slice(0, index), ...array.slice(index + 1)];
	}
	const removeBoard = (boardId:number):void => {
		const index = board.findIndex((el) => el.id === boardId);
		setBoard([...board.slice(0, index), ...board.slice(index + 1)]);
	};
	////
	const createField = (boardId:number, field:BoardField):void => {
		const index = board.findIndex((el) => el.id === boardId);
		const newItem:Board = {
			...board[index],
			fields: [field, ...board[index].fields],
		};
		setBoard((prev) => {
			return [...prev.slice(0, index), newItem, ...prev.slice(index + 1)];
		});
	};

	const removeField = (boardId:number, fieldId:number):void => {
		const indexBoard = board.findIndex((el) => el.id === boardId);
		const indexField = board[indexBoard].fields.findIndex(
			(el) => el.id === fieldId
		);
		const newItem:Board = {
			...board[indexBoard],
			fields: [
				...board[indexBoard].fields.slice(0, indexField),
				...board[indexBoard].fields.slice(indexField + 1),
			],
		};
		setBoard([
			...board.slice(0, indexBoard),
			newItem,
			...board.slice(indexBoard + 1),
		]);
	};
	/////
	const onDragStart = ({boardProps=null, field=null, e}:DragParams) => {
		(e.target as HTMLDivElement).classList.add("active");
		(e.target as HTMLDivElement).closest(".board")?.classList.add("active");

		setActive({ ...active, move: { board: boardProps, field } });
	};
	const onDragOver = ({boardProps=null, field=null, e}:DragParams) => {
	
		e.preventDefault();
		(e.target as HTMLDivElement).classList.add("activeOver");
		(e.target as Element).closest(".board")?.classList.add("activeOver");

		setActive({ ...active, receiving: { board: boardProps, field } });
	};
	const onDragLeave = ({e}:DragParams) => {
		(e.target as HTMLDivElement).classList.remove("activeOver");
		(e.target as HTMLDivElement).closest(".board")?.classList.remove("activeOver");
		setActive({ ...active, receiving: { board: null, field: null } });
	};
	const onDrop = ({e}:DragParams) => {
		
		(e.target as HTMLDivElement).classList.remove("activeOver");
		(e.target as HTMLDivElement).closest(".board")?.classList.remove("activeOver");

		const indexBoardAdd = board.findIndex(
			(el) => el.id === active.receiving.board?.id
		);
		
		const indexFieldAdd = board[indexBoardAdd].fields.findIndex((el) => {
			if (el.id === active.receiving.field?.id) return el;
			if (active.receiving.field === null) return 0;
		});
		
		let newBoard:Board;
		if (active.receiving.board?.id === active.move.board?.id) {
			newBoard = {
				...board[indexBoardAdd],
				fields: board[indexBoardAdd].fields.map((el) => {
					if (el.id === active.move.field?.id) {
						return { ...active.receiving.field };
					}
					if (el.id === active.receiving.field?.id) {
						return { ...active.move.field };
					}
					return el;
				}),
			};
		} else  {
			if(active.move.field){
				newBoard = {
					...board[indexBoardAdd],
					fields: [
						...board[indexBoardAdd].fields.slice(0, indexFieldAdd + 1),
						active.move.field,
						...board[indexBoardAdd].fields.slice(indexFieldAdd + 1),
					],
				};
			}else{
				newBoard = {
					...board[indexBoardAdd],
					fields: [
						...board[indexBoardAdd].fields.slice(0, indexFieldAdd + 1),
						...board[indexBoardAdd].fields.slice(indexFieldAdd + 1),
					],
				};
			}
			
		}

		setBoard([
			...board.slice(0, indexBoardAdd),
			newBoard,
			...board.slice(indexBoardAdd + 1),
		]);
	};
	const onDragEnd = ({e}:DragParams) => {
		(e.target as HTMLDivElement).classList.remove("active");
		if (e.target instanceof Element) {
			(e.target as HTMLDivElement).closest(".board")?.classList.remove("active");
		}
		
		if (active.receiving.board === null) return;

		
			if (active.receiving.board.id !== active.move.board?.id) {
				const indexBoardFrom = board.findIndex(
					(el) => el.id === active.move.board?.id
				);
				const indexFieldFrom = board[indexBoardFrom].fields.findIndex(
					(el) => el.id === active.move.field?.id
				);
				const newBoardFrom = {
					...board[indexBoardFrom],
					fields: [
						...board[indexBoardFrom].fields.slice(0, indexFieldFrom),
						...board[indexBoardFrom].fields.slice(indexFieldFrom + 1),
					],
				};
				setBoard([
					...board.slice(0, indexBoardFrom),
					newBoardFrom,
					...board.slice(indexBoardFrom + 1),
				]);
			
		}
		
	};

	return (
		<div className="wrap">
			<div className="createBoard">
				<h2>New board</h2>
				<input
					type="text"
					value={inputValue}
					onChange={(e) => setInputValue(e.target.value)}
				/>
				<button onClick={() => createBoard()}>Create board</button>
			</div>
			<div className="blockBoards">
				{board.length !== 0 ? (
					<>
						{board.map((el, key) => {
							return (
								<Board
									key={key}
									board={el}
									removeBoard={removeBoard}
									settingField={{ createField, removeField }}
									dragEvent={{
										onDragStart,
										onDragOver,
										onDragLeave,
										onDrop,
										onDragEnd,
									}}
								/>
							);
						})}
					</>
				) : (
					<div className="emptyBoard">Not found boarders{`((`}</div>
				)}
			</div>
		</div>
	);
};




export default App;
