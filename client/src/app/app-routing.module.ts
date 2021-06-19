import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardContentComponent } from './dashboard-content/dashboard-content.component';
import { FriendRequestsComponent } from './dashboard-content/discover-left/friend-requests/friend-requests.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './_guards/auth.guard';
import { DiscoverComponent } from './dashboard-content/discover/discover.component';
import { MessagesLeftComponent } from './dashboard-content/messages/messages-left/messages-left.component';
import { MessagesComponent } from './dashboard-content/messages/messages.component';
import { combineAll } from 'rxjs/operators';

const routes: Routes = [
	{ path: 'login', component: LoginComponent },
	{
		path: '',
		component: DashboardContentComponent,
		canActivate: [AuthGuard],
		children: [
			{
				path: 'discover',
				children: [
					{
						path: '',
						component: FriendRequestsComponent,
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
				path: 'messages',
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
		],
	},
	{
		path: 'messages',
		component: DashboardContentComponent,
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
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
