import { Injectable } from '@angular/core';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { BehaviorSubject } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class TabsService {
	private tab = new BehaviorSubject('0');
	currTab = this.tab.asObservable();

	constructor() {}

	setTab(i: string) {
		this.tab.next(i);
	}
}
