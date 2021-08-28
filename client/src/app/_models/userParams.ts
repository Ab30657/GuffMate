import { User } from './user';
export class UserParams {
	gender: string;
	pageNumber = 1;
	pageSize = 10;
	orderBy = 'lastActive';
	constructor(user: User) {
		this.gender = user.gender;
	}
}
