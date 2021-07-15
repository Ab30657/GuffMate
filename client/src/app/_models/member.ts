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
	phone: string;
	twoFactorEnabled: boolean;
}
