import React, { useState } from "react";
import CreateField from "../create-field";
import {BoardField,BoardType,DragParams}from '../type'

type Props={
	board:BoardType,
	removeBoard:(id:number)=>void,
	settingField:{
		createField:(boardId:number, field:BoardField)=>void,
		removeField:(boardId:number, fieldId:number)=>void,
	},
	dragEvent:{
		onDragStart:(obj:DragParams)=>void,
		onDragOver:(obj:DragParams)=>void,
		onDragLeave:(obj:DragParams)=>void,
		onDrop:(obj:DragParams)=>void,
		onDragEnd:(obj:DragParams)=>void,
	}
	
}
const Board:React.FC<Props> = ({ board, removeBoard, settingField, dragEvent }) => {
	const { id, fields } = board;
	return (
		<div className="board" draggable={true}>
			<div className="headBoard">
				<h3>{board.title}</h3>
				<button onClick={() => removeBoard(id)}>Remove</button>
			</div>
			<div className="fields">
				<CreateField
					boardId={id}
					createField={settingField.createField}
					fields={fields}
				/>
				{fields.length !== 0 ? (
					<>
						{fields.map((field, ind) => {
							return (
								<div
									key={field.id}
									className="field"
									draggable={true}
									onDragStart={(e) =>
										dragEvent.onDragStart({ boardProps: board, field, e })
									}
									onDragOver={(e) =>
										dragEvent.onDragOver({ boardProps: board, field, e })
									}
									onDragLeave={(e) => dragEvent.onDragLeave({ e })}
									onDrop={(e) => dragEvent.onDrop({ e })}
									onDragEnd={(e) => dragEvent.onDragEnd({ e })}
								>
									<span>{field.title}</span>
									<button
										className="remove"
										onClick={() => settingField.removeField(id, field.id)}
									>
										rem
									</button>
								</div>
							);
						})}
					</>
				) : (
					<div
						className="fieldEmpty"
						draggable={true}
						onDragOver={(e) =>
							dragEvent.onDragOver({ boardProps: board, field: null, e })
						}
						onDragLeave={(e) => dragEvent.onDragLeave({ e })}
						onDrop={(e) => {
							dragEvent.onDrop({ e });
						}}
					>
						<span style={{ textAlign: "center" }}>Пустота...</span>
					</div>
				)}
			</div>
		</div>
	);
};
export default Board;
