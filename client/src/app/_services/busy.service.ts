import { Injectable } from '@angular/core';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

@Injectable({
	providedIn: 'root',
})
export class BusyService {
	busyRequestCount = 0;

	constructor(private spinnerService: NgxSpinnerService) {}

	busy() {
		this.busyRequestCount++;
		this.spinnerService.show(undefined, {
			color: '#2288fa',
			fullScreen: false,
		});
	}

	idle() {
		this.busyRequestCount--;
		if (this.busyRequestCount <= 0) {
			this.busyRequestCount = 0;
			this.spinnerService.hide();
		}
	}
}
