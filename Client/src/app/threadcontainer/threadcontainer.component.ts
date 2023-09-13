import { Component, Input, OnInit, ViewChild, ViewContainerRef, ComponentRef, AfterContentInit, AfterViewInit} from '@angular/core';
import { Post } from 'src/app/_models/post';
import { HttpClient } from '@angular/common/http';
import { AccountService } from '../_services/account.service';
import { take } from 'rxjs';
import { User } from '../_models/user';

@Component({
  selector: 'app-threadcontainer',
  templateUrl: './threadcontainer.component.html',
  styleUrls: ['./threadcontainer.component.css']
})
export class ThreadcontainerComponent implements OnInit, AfterViewInit {

  @Input() post: Post | undefined;
  @ViewChild('container', {read: ViewContainerRef}) container: ViewContainerRef | undefined;

  threadLength: number = 0;
  isExpaned: boolean = false;

  posts: Post[] = [];
  subPosts: Post[] = [];

  threadIndex: number = 0; // TODO: change to bool isSubPost

  user: User | undefined;

  createPostActive: boolean = false;

  authHeader = {'Authorization': ''};
  
  constructor(private accountService: AccountService, private http: HttpClient) { 
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: user => {
        if(user){
          this.user = user;
          this.authHeader.Authorization = 'Bearer ' + this.user.token;
        }
      }
    })
  }

  ngAfterViewInit(): void {
    if(this.post == undefined)
    {
      this.getThread(0);
    }
    else{
      this.getThreadLength();
    }
  }

  getThreadLength() {
    const headers = this.authHeader;
    return this.http.get<number>('http://localhost:5085/users/thread-length/' + this.post?.id, {headers}).subscribe({
      next: length => this.threadLength = length,
      error: err => console.log(err)
    })
  }

  ngAfterContentInit(): void { }
  ngOnInit(): void { }

  getThread(id: number) {
    const headers = this.authHeader;
    return this.http.get<Post[]>('http://localhost:5085/users/threads/' + id, {headers}).subscribe({
      next: posts => {
        if(id == 0){
          this.posts = posts;
          this.loadPosts();
        }else{
          this.subPosts = posts;
          this.loadSubPosts();
        }
        
      },
      error: err => console.log(err)
    })
  }

  getPost(id: number){
    const headers = this.authHeader;
    return this.http.get<Post>('http://localhost:5085/users/post/' + id, {headers}).subscribe({
      next: res => {
        if(this.post){
          this.addComponent(res, true);
        }else{
          this.addComponent(res, false);
        }
      },
      error: err => console.log(err)
    })
  }

  loadPosts()
  {
    this.posts.forEach(post => {
      this.addComponent(post, false);
    });
  }
  
  loadSubPosts() {
    this.subPosts.forEach(post => {
      this.addComponent(post, true);
    });
  }

  removeSubposts(){
    this.container?.clear();
  }

  addComponent(post: Post, incrementThreadIndex: boolean) {
    if(this.container) {

      const component = this.container.createComponent(ThreadcontainerComponent);

      if(component){
        component.instance.post = post;
        if(incrementThreadIndex) {
          component.instance.threadIndex = this.threadIndex + 1;
        }
        
        component.changeDetectorRef.detectChanges();
      }
    }
  }

  expandToggle(){
    if(this.isExpaned){
      this.removeSubposts();
      this.isExpaned = false;
    }else{
      if(this.post?.id){
        this.getThread(this.post?.id);
        this.isExpaned = true;
      }     
    }
  }

  createPost() {
    this.createPostActive = true;
  }

  cancelCreatePost(){
    this.createPostActive = false;
  }

  newPostCreated(id: number){
    if(this.post){
      this.getPost(id);
      this.getThreadLength();
      this.isExpaned = true;
    }else{
      this.getPost(id);
    }
  }

  getPadding() {
    let padding: string = this.threadIndex * 15 + 'px';
    return padding;
  }

  getWidth() {
    let width : string = '100%';
    if(this.threadIndex > 0) {
      width = '95%';
    }
    return width;
  }
  
}
