import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ThreaddisplayComponent } from './threaddisplay/threaddisplay.component';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { CreatePostComponent } from './create-post/create-post.component';
import { LogoutComponent } from './logout/logout.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: '',
    children: [
      {path: 'threaddisplay', component: ThreaddisplayComponent},
      {path: 'register', component: RegisterComponent},
      {path: 'posttest', component: CreatePostComponent},
      {path: 'users/delete-post/:id', component: HomeComponent},
      {path: 'logout', component: LogoutComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
