import { Member } from './member';
export interface TimeLineEvent {
	Date: Date; //Date and Time of the Event post
	Views: number;
	Content: string;
	Shares: number;
	// LikedUsers: Member[]; //Like Count is number of this array
	// Comments: Comment[]; //Comment Count is number of this array
	LikedUsers: number;
	Comments: number;
}

export interface Comment {
	Text: string;
	MadeBy: Member;
}
