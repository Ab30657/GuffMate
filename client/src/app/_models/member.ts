import { Photo } from './photo';

export interface Member {
	id: number;
	name: string;
	photoUrl: string;
	username: string;
	photos: Photo[];
	lastActive: Date;
}
