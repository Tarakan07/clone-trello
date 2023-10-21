import React, { useState } from "react";

import {BoardField} from '../type'
let changeId = 8;

type Props={
	boardId:number,
	createField:(boardId:number, field:BoardField)=>void,
	fields:BoardField[]
}
const CreateField:React.FC<Props> = ({ boardId, createField, fields }) => {
	const [value, setValue] = useState("");
	return (
		<div className="createField">
			<input
				type="text"
				value={value}
				onChange={(e) => setValue(e.target.value)}
				placeholder="Writing fields..."
			/>
			<button
				onClick={() => {
					createField(boardId, { id: changeId + 1, title: value });
					setValue("");
				}}
			>
				Add
			</button>
		</div>
	);
};
export default CreateField;
