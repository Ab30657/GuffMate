import { Message } from './message';
export interface Friend {
	status: number;
	username: string;
	name: string;
	photoUrl: string;
	gender: string;
	latestMessage: Message;
}
export enum RequestStatus {
	SentPending = 0,
	ReceivedPending = 1,
	Accepted = 2,
	Rejected = 3,
	None = 4,
}
