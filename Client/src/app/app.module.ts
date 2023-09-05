import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ThreaddisplayComponent } from './threaddisplay/threaddisplay.component';
import { PostComponent } from './post/post.component';
import { ThreadcontainerComponent } from './threadcontainer/threadcontainer.component';

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    ThreaddisplayComponent,
    PostComponent,
    ThreadcontainerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
