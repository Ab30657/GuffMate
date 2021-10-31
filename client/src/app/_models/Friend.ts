export interface Friend {
	name: string;
	Status: RequestStatus;
	gender: string;
	photoUrl: string;
	username: string;
}
export enum RequestStatus {
	None,
	Accepted,
	Rejected,
	Blocked,
}
