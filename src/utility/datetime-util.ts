export const format_datetime = (timestamp: number) => {
	const date = new Date(timestamp);

	return `${date.getFullYear()}-${date.getMonth()}-${date.getDay()} @ ${date.getHours()}:${date.getHours()}`;
};
