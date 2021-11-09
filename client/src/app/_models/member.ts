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
	friendStatus: number; //1- Pending		2-Accepted		3-Rejected		4-NoRequest/None
}
