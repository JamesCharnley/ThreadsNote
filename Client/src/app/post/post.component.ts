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


  baseUrl = 'http://localhost:5085/';
  user: User | undefined;
  
  constructor(private accountService: AccountService, private http: HttpClient) { 
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: user => {
        if(user) this.user = user
      }
    })
  }

  ngOnInit(): void {
    if(this.post)
    {
      console.log("postid = " + this.post.id);
    }
  }

  expandTogglePressed() // user clicked expand post to open sub posts
  {
    this.expandToggle.emit(); // emit function call to parent (ThreadContainerComponent)
  }
  addPost(){
    console.log("add post");
    this.createPost.emit();
    
  }

  deletePost() {
    console.log("post id to delete: " + this.post?.id);
    const headers = { 'Authorization': 'Bearer ' + this.user?.token};
    return this.http.delete<number>(this.baseUrl + 'users/delete-post/' + this.post?.id, {headers}).pipe().subscribe({
      next: res => console.log(res),
      error: err => console.log(err)
    })
    //this.uploader?.uploadAll();
  }
  
}
