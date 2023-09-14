import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { Post } from 'src/app/_models/post';
import { AccountService } from '../_services/account.service';
import { User } from '../_models/user';
import { take } from 'rxjs';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {
  
  @Input() post: Post | undefined;
  @Input() threadLength: number | undefined;
  @Output("expandToggle") expandToggle: EventEmitter<any> = new EventEmitter();
  @Output("createPost") createPost: EventEmitter<any> = new EventEmitter();
  @Output("postDeleted") postDeleted: EventEmitter<any> = new EventEmitter();
  @Output("popOutThreadEmitter") popOutThreadEmitter: EventEmitter<any> = new EventEmitter();

  baseUrl = 'http://localhost:5085/';
  user: User | undefined;
  authHeader = {'Authorization': ''};
  
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

  ngOnInit(): void { }

  expandTogglePressed() // user clicked expand post to open sub posts
  {
    this.expandToggle.emit(); // emit function call to parent (ThreadContainerComponent)
  }

  addPost(){
    this.createPost.emit();
  }

  deletePost() {
    const headers = this.authHeader;
    return this.http.delete<number>(this.baseUrl + 'users/delete-post/' + this.post?.id, {headers}).pipe().subscribe({
      next: _ => this.postDeleted.emit(),
      error: err => console.log(err)
    })
  }

  popOutThread(){
    if(this.post){
      this.popOutThreadEmitter.emit(this.post);
    }
  }
  
}
