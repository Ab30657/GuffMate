import { Photo } from './photo';

export interface Member {
	id: number;
	username: string;
	photoUrl: string;
	knownAs: string;
	gender: string;
	status: string;
	lastActive: Date;
	photos: Photo[];
}
