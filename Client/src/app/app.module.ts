import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ThreaddisplayComponent } from './threaddisplay/threaddisplay.component';
import { PostComponent } from './post/post.component';
import { ThreadcontainerComponent } from './threadcontainer/threadcontainer.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { HomeComponent } from './home/home.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { UserinterfaceComponent } from './userinterface/userinterface.component';
import { CreatePostComponent } from './create-post/create-post.component';
import { FileUploadModule } from 'ng2-file-upload';
import { LogoutComponent } from './logout/logout.component';
import { ErrorInterceptor } from './_interceptors/error.interceptor';
@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    ThreaddisplayComponent,
    PostComponent,
    ThreadcontainerComponent,
    RegisterComponent,
    LoginComponent,
    HomeComponent,
    UserinterfaceComponent,
    CreatePostComponent,
    LogoutComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgbModule,
    FormsModule,
    ToastrModule.forRoot(),
    FileUploadModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
