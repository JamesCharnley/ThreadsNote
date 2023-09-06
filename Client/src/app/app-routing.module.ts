import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ThreaddisplayComponent } from './threaddisplay/threaddisplay.component';

const routes: Routes = [
  {path: '',
    children: [
      {path: 'image', component: ThreaddisplayComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
