import {
	Component,
	OnInit,
	ViewEncapsulation,
	ViewChild,
	AfterViewInit,
} from '@angular/core';
import { TabsService } from '../../_services/tabs.service';
import { TabsetComponent } from 'ngx-bootstrap/tabs';

@Component({
	selector: 'app-settings',
	templateUrl: './settings.component.html',
	styleUrls: ['./settings.component.css'],
	encapsulation: ViewEncapsulation.Emulated,
})
export class SettingsComponent implements OnInit, AfterViewInit {
	@ViewChild('smallnav', { static: false }) tabs: TabsetComponent;
	activeTab;
	constructor(private tabService: TabsService) {}

	ngOnInit(): void {}

	ngAfterViewInit(): void {
		this.tabService.currTab.subscribe((x) => {
			this.activeTab = x;
			this.tabs.tabs[+this.activeTab].active = true;
		});
	}

	setTab(i: string) {
		this.tabService.setTab(i);
	}
}
