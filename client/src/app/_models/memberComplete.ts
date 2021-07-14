import { Photo } from './photo';

export interface completeMember {
	gender: string;
	status: string;
	twoFAEnabled: boolean;
	SmsAuthEnabled: boolean;
	interests: string[];
	photo: Photo;
}
