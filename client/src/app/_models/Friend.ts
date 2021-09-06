export interface Friend {
	i: number;
	Status: RequestStatus;
}
export enum RequestStatus {
	None,
	Accepted,
	Rejected,
	Blocked,
}
