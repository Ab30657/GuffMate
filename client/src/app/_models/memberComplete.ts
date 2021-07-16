import { Interest } from './interest';
import { Photo } from './photo';

export interface completeMember {
	gender: string;
	status: string;
	twoFAEnabled: boolean;
	SmsAuthEnabled: boolean;
	interests: string[];
}
