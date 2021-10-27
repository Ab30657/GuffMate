export interface Friend {
	id: number;
	Status: RequestStatus;
}
export enum RequestStatus {
	None,
	Accepted,
	Rejected,
	Blocked,
}
