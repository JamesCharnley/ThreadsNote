import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Post } from '../_models/post';
import { AccountService } from '../_services/account.service';
import { HttpClient } from '@angular/common/http';
import { User } from '../_models/user';
import { take } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  styleUrls: ['./edit-post.component.css']
})
export class EditPostComponent implements OnInit {
  
  @Input() post: Post | undefined;
  @Output("cancelEditPost") cancelEditPostEmitter: EventEmitter<any> = new EventEmitter();
  @Output("postEditComplete") newPostCreated: EventEmitter<any> = new EventEmitter();
  
  model: any = {};
  user: User | undefined;
  authHeader = {'Authorization': ''};
  baseUrl = environment.apiUrl;
  
  constructor(private accountService: AccountService, private http: HttpClient) { 
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: user => {
        if(user) {
          this.user = user;
          this.authHeader.Authorization = 'Bearer ' + user.token;
        }
      }
    })
  }

  ngOnInit(): void {
    if(this.post){
      this.model.id = this.post.id;
      this.model.title = this.post.title;
      this.model.content = this.post.contentText;
      console.log("id = " + this.post.id);
    }
  }

  submitPost(){
    console.log(this.model);
    const headers = this.authHeader;
    return this.http.put<number>(this.baseUrl + '/thread/edit-post', this.model, {headers}).pipe().subscribe({
      next: res => console.log(res),
      error: err => console.log(err)
    })
  }

  cancelEditPost(){
    this.cancelEditPostEmitter.emit();
  }

}
