import { Photo } from './photo';

export interface Member {
	id: number;
	name: string;
	photoUrl: string;
	username: string;
	gender: string;
	status: string;
	lastActive: Date;
	photos: Photo[];
	twoFAEnabled: boolean;
	SmsAuthEnabled: boolean;
	interests: string[];
}
