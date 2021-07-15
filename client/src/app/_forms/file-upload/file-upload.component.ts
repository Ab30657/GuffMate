import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'app-file-upload',
	templateUrl: './file-upload.component.html',
	styleUrls: ['./file-upload.component.css'],
})
export class FileUploadComponent implements OnInit {
	imagePath;
	@Output() img = new EventEmitter();
	constructor() {}

	ngOnInit(): void {}

	onFileSelected(e) {
		console.log(e);
		const files = e.target.files;
		const reader = new FileReader();

		if (files && files.length) {
			const [file] = files;
			reader.readAsDataURL(file);

			reader.onload = () => {
				this.imagePath = reader.result as string;
			};
		}
		this.img.emit({ event: e, imagePath: this.imagePath });
	}
}
