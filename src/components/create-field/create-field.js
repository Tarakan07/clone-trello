import React, { useState } from "react";
let changeId = 8;
const CreateField = ({ boardId, createField, fields }) => {
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
