import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardContentComponent } from './dashboard-content/dashboard-content.component';
import { FriendRequestComponent } from './dashboard-content/discover/discover-left/friend-request/friend-request.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './_guards/auth.guard';
import { DiscoverComponent } from './dashboard-content/discover/discover.component';
import { MessagesLeftComponent } from './dashboard-content/messages/messages-left/messages-left.component';
import { MessagesComponent } from './dashboard-content/messages/messages.component';
import { combineAll } from 'rxjs/operators';
import { SettingsLeftComponent } from './dashboard-content/settings/settings-left/settings-left.component';
import { SettingsComponent } from './dashboard-content/settings/settings.component';
import { DiscoverLeftComponent } from './dashboard-content/discover/discover-left/discover-left.component';
import { ProfileCompleteComponent } from './profile-complete/profile-complete.component';
import { UserProfileComponent } from './user-profile/user-profile.component';

const routes: Routes = [
	{
		path: 'login',
		component: LoginComponent,
		data: { animationState: 'one' },
	},
	{
		path: 'profilecompletion',
		component: ProfileCompleteComponent,
		canActivate: [AuthGuard],
	},
	{
		path: '',
		component: DashboardContentComponent,
		canActivate: [AuthGuard],
		data: { animationState: 'two' },
		children: [
			{
				path: '',
				redirectTo: 'discover',
				pathMatch: 'full',
			},

			{
				path: 'discover',
				children: [
					{
						path: '',
						component: DiscoverLeftComponent,
						canActivate: [AuthGuard],
						outlet: 'left',
					},
					{
						path: '',
						component: DiscoverComponent,
						canActivate: [AuthGuard],
						outlet: 'right',
					},
				],
			},
			{
				path: 'messages/:username',
				pathMatch: 'full',
				children: [
					{
						path: '',
						component: MessagesLeftComponent,
						canActivate: [AuthGuard],
						outlet: 'left',
					},
					{
						path: '',
						component: MessagesComponent,
						canActivate: [AuthGuard],
						outlet: 'right',
					},
				],
			},
			{
				path: 'settings',
				children: [
					{
						path: '',
						component: SettingsLeftComponent,
						canActivate: [AuthGuard],
						outlet: 'left',
					},
					{
						path: '',
						component: SettingsComponent,
						canActivate: [AuthGuard],
						outlet: 'right',
					},
				],
			},
		],
	},
	{
		path: 'messages',
		pathMatch: 'full',
		redirectTo: 'messages/',
	},
	{
		path: ':username',
		pathMatch: 'full',
		component: UserProfileComponent,
		canActivate: [AuthGuard],
	},
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
