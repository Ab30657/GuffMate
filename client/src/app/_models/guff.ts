import { GuffComment } from './comment';
import { Like } from './like';

export interface Guff {
	DatePosted: Date;
	GuffContent: string;
	Comments: GuffComment[];
	Likes: Like[];
	Shares: any[];
}
