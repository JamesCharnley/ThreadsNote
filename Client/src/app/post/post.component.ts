import { HttpClient } from '@angular/common/http';
import { Component, ComponentRef, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { Post } from 'src/app/_models/post';
import { AccountService } from '../_services/account.service';
import { User } from '../_models/user';
import { take } from 'rxjs';
import { ThreadcontainerComponent } from '../threadcontainer/threadcontainer.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {
  @Input() ownerThreadContainer: ComponentRef<ThreadcontainerComponent> | undefined;
  @Input() post: Post | undefined;
  @Input() threadLength: number | undefined;
  @Output("expandToggle") expandToggle: EventEmitter<any> = new EventEmitter();
  @Output("createPost") createPost: EventEmitter<any> = new EventEmitter();
  @Output("editPostEmitter") editPostEmitter: EventEmitter<any> = new EventEmitter();
  @Output("postDeleted") postDeleted: EventEmitter<any> = new EventEmitter();
  @Output("popOutThreadEmitter") popOutThreadEmitter: EventEmitter<any> = new EventEmitter();
  @Output("stepThreadForwardEmitter") stepThreadForwardEmitter: EventEmitter<any> = new EventEmitter();
  @Output("stepThreadBackEmitter") stepThreadBackEmitter: EventEmitter<any> = new EventEmitter();

  baseUrl = environment.apiUrl;
  user: User | undefined;
  authHeader = {'Authorization': ''};

  deleteConfirmationActive: boolean = false;
  
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
    return this.http.delete(this.baseUrl + 'thread/delete-post/' + this.post?.id, {headers}).subscribe({
      next: _ => this.postDeleted.emit(),
      error: err => console.log(err)
    })
  }

  popOutThread(){
    if(this.post){
      this.popOutThreadEmitter.emit(this.post);
    }
  }

  stepThreadForward(){
    this.stepThreadForwardEmitter.emit(this.post);
  }

  stepThreadBack(){
    this.stepThreadBackEmitter.emit(this.post);
  }

  editPost(){
    this.editPostEmitter.emit();
  }

  deletePostPressed(){
    if(this.deleteConfirmationActive){
      this.deleteConfirmationActive = false;
    }else{
      this.deleteConfirmationActive = true;
    }
  }
  
}
