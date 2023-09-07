import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ThreaddisplayComponent } from './threaddisplay/threaddisplay.component';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: '',
    children: [
      {path: 'threaddisplay', component: ThreaddisplayComponent},
      {path: 'register', component: RegisterComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }