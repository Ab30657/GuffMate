import {
	AfterViewInit,
	Component,
	ElementRef,
	EventEmitter,
	OnInit,
	Output,
	ViewChild,
} from '@angular/core';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { TabsService } from '../../../_services/tabs.service';

@Component({
	selector: 'app-settings-left',
	templateUrl: './settings-left.component.html',
	styleUrls: ['./settings-left.component.css'],
})
export class SettingsLeftComponent implements OnInit {
	activeTab;
	constructor(private tabService: TabsService) {}

	ngOnInit(): void {
		this.tabService.currTab.subscribe((x) => {
			this.activeTab = x;
		});
	}

	setTab(i: string) {
		this.tabService.setTab(i);
	}
}
