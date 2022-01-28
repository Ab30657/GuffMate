import { User } from './user';
export class UserParams {
	gender = '';
	pageNumber = 1;
	pageSize = 10;
	orderBy = 'lastActive';
	predicate = 'received';
	constructor() {}
}
