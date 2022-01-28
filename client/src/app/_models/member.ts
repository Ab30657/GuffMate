import { Interest } from './interest';
import { Photo } from './photo';

export interface Member {
	id: number;
	name: string;
	photoUrl: string;
	username: string;
	photos: Photo[];
	lastActive: Date;
	interests: Interest[];
	gender: string;
	status: string;
	phoneNumber: string;
	twoFactorEnabled: boolean;
	email: string;
	friends: string[];
	friendStatus: number; // SentPending = 0, // ReceivedPending = 1,// Accepted = 2,// Rejected = 3,// None = 4,
}
