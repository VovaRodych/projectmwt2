import { Routes } from '@angular/router';
import { UsersComponent } from './users/users.component';
import { LoginComponent } from './login/login.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ExtendedUsersComponent } from './extended-users/extended-users.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { authGuard, authMatchGuard } from '../guards/auth.guard';
import {EditFilmComponent} from "./edit-film/edit-film.component";

export const routes: Routes = [
  {path: 'users', component: UsersComponent},
  {path: 'extended-users', component: ExtendedUsersComponent, canActivate:[authGuard]},
  {path: 'login', component: LoginComponent},
  {path: 'register',
   loadComponent: () => import('./register/register.component')//.then(com => com.RegisterComponent)
  },
  {path: 'chat',
   loadComponent: () => import('./chat/chat.component').then(com => com.ChatComponent)
  },
  {path: 'user/edit/:id', component: EditUserComponent, data: {daco : 1}},
  {path: 'user/new', component: EditUserComponent},
  { path: 'groups',
    loadChildren: () => import('../modules/groups/groups.module'),
    canActivate: [authGuard],
    canMatch: [authMatchGuard]
  },
  {path: 'films', loadComponent: () => import('./films/films.component').then(mod => mod.FilmsComponent)},
  {path: 'film/edit/:id', component: EditFilmComponent, data: {daco: 1}, canActivate:[authGuard]},
  {path: 'film/new', component: EditFilmComponent, canActivate:[authGuard]},
  {path: '', redirectTo: '/login', pathMatch: 'full'},
  {path: '**', component: PageNotFoundComponent}
];
