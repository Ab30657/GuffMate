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
	phoneNumberConfirmed: boolean;
	emailConfirmed: boolean;
	email: string;
	friends: string[];
	friendStatus: number; // None= 0, // Accepted= 1,// SentPending= 2,// ReceivedPending= 3,// Rejected= 4,
}
