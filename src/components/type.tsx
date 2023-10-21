type BoardType={
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
		board:BoardType|null,
		field:BoardField|null,
	},
	receiving:{
		board:BoardType|null,
		field:BoardField|null,
	}
}

type DragParams={
	boardProps?:BoardType|null,
	field?:BoardField|null,
	e:React.DragEvent<HTMLDivElement>
}

export {BoardType,BoardField,ActiveBoard,DragParams}