import { GuffComment } from './comment';
import { Like } from './like';

export interface Guff {
	DatePosted: Date;
	guffContent: string;
	Comments: GuffComment[];
	Likes: Like[];
	Shares: any[];
}
