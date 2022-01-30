import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardContentComponent } from './dashboard-content/dashboard-content.component';
import { NavComponent } from './nav/nav.component';
import { LoginComponent } from './login/login.component';
import { DiscoverComponent } from './dashboard-content/discover/discover.component';
import { UserCardsComponent } from './dashboard-content/discover/user-cards/user-cards.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FriendRequestComponent } from './dashboard-content/discover/discover-left/friend-request/friend-request.component';
import { MessagesComponent } from './dashboard-content/messages/messages.component';
import { MessagesLeftComponent } from './dashboard-content/messages/messages-left/messages-left.component';
import { JwtInterceptor } from './_interceptors/jwt.interceptor';
import { NgxSpinnerModule } from 'ngx-spinner';
import { LoadingInterceptor } from './_interceptors/loading.interceptor';
import { SettingsComponent } from './dashboard-content/settings/settings.component';
import { SettingsLeftComponent } from './dashboard-content/settings/settings-left/settings-left.component';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TextInputComponent } from './_forms/text-input/text-input.component';
import { ProfileCompleteComponent } from './profile-complete/profile-complete.component';
import { DiscoverLeftComponent } from './dashboard-content/discover/discover-left/discover-left.component';
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { GalleryImageComponent } from './gallery-image/gallery-image.component';
import { FileUploadComponent } from './_forms/file-upload/file-upload.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { GalleryImagePipe } from './pipes/gallery-image.pipe';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { TimelineEventComponent } from './user-profile/timeline-event/timeline-event.component';
import { ToastrModule } from 'ngx-toastr';
import { FfbToastrComponent } from './components/ffb-toastr/ffb-toastr.component';
import { PickerModule } from '@ctrl/ngx-emoji-mart';

@NgModule({
	declarations: [
		AppComponent,
		DashboardContentComponent,
		NavComponent,
		LoginComponent,
		DiscoverComponent,
		UserCardsComponent,
		MessagesComponent,
		MessagesLeftComponent,
		SettingsComponent,
		SettingsLeftComponent,
		TextInputComponent,
		ProfileCompleteComponent,
		FriendRequestComponent,
		DiscoverLeftComponent,
		GalleryImageComponent,
		FileUploadComponent,
		GalleryImagePipe,
		UserProfileComponent,
		TimelineEventComponent,
		FfbToastrComponent,
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		BrowserAnimationsModule,
		HttpClientModule,
		FormsModule,
		ReactiveFormsModule,
		NgxSpinnerModule,
		TabsModule,
		ImageCropperModule,
		NgbModule,
		PaginationModule.forRoot(),
		ButtonsModule.forRoot(),
		ToastrModule.forRoot({
			positionClass: 'toast-bottom-right',
			timeOut: 10000,
		}),
		PickerModule,
	],
	entryComponents: [FfbToastrComponent],
	providers: [
		{
			provide: HTTP_INTERCEPTORS,
			useClass: JwtInterceptor,
			multi: true,
		},
		{
			provide: HTTP_INTERCEPTORS,
			useClass: LoadingInterceptor,
			multi: true,
		},
	],
	bootstrap: [AppComponent],
})
export class AppModule {}
