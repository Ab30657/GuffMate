import { Pipe, PipeTransform } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Photo } from '../_models/photo';

@Pipe({
	name: 'galleryImage',
})
export class GalleryImagePipe implements PipeTransform {
	transform(value: Photo[]): Observable<Photo[]> {
		return of(value?.filter((x) => !x.isMain));
	}
}
