import { GuffComment } from './comment';
import { Like } from './like';

export interface Guff {
	id: number;
	datePosted: Date;
	guffContent: string;
	comments: GuffComment[];
	likedUsers: Like[];
	shares: any[];
}
