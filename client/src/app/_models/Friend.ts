export interface Friend {
	FriendId: number;
	Status: RequestStatus;
}
export enum RequestStatus {
	None,
	Accepted,
	Rejected,
	Blocked,
}
