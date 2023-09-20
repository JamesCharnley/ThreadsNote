import { Component, Input, OnInit, ViewChild, ViewContainerRef, ComponentRef, AfterContentInit, AfterViewInit, ViewRef, Output, EventEmitter} from '@angular/core';
import { Post } from 'src/app/_models/post';
import { HttpClient } from '@angular/common/http';
import { AccountService } from '../_services/account.service';
import { Subscription, take } from 'rxjs';
import { User } from '../_models/user';

@Component({
  selector: 'app-threadcontainer',
  templateUrl: './threadcontainer.component.html',
  styleUrls: ['./threadcontainer.component.css']
})
export class ThreadcontainerComponent implements OnInit, AfterViewInit {

  @Input() post: Post | undefined;

  @ViewChild('container', {read: ViewContainerRef}) container: ViewContainerRef | undefined;
  @Output("postDeleted") postDeleted: EventEmitter<any> = new EventEmitter();
  @Output("popOutThreadEmitter") popOutThreadEmitter: EventEmitter<any> = new EventEmitter();
  @Output("stepThreadForwardEmitter") stepThreadForwardEmitter: EventEmitter<any> = new EventEmitter();
  @Output("stepThreadBackEmitter") stepThreadBackEmitter: EventEmitter<any> = new EventEmitter();

  threadLength: number = 0;
  isExpaned: boolean = false;

  posts: Post[] = [];
  subPosts: Post[] = [];

  threadIndex: number = 0; // TODO: change to bool isSubPost

  user: User | undefined;

  createPostActive: boolean = false;

  authHeader = {'Authorization': ''};

  component : ComponentRef<ThreadcontainerComponent> | undefined;
  
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
    return this.http.get<number>('http://localhost:5085/thread/thread-length/' + this.post?.id, {headers}).subscribe({
      next: length => this.threadLength = length,
      error: err => console.log(err)
    })
  }

  ngAfterContentInit(): void { }
  ngOnInit(): void { }

  async getThread(id: number) {
    const headers = this.authHeader;
    return await this.http.get<Post[]>('http://localhost:5085/thread/' + id, {headers}).subscribe({
      next: posts => {
        if(id == 0){
          this.posts = posts;
          this.loadPosts();
        }else{
          this.subPosts = posts;
          this.threadLength = this.subPosts.length;
          this.loadSubPosts();
        }
        
      },
      error: err => {
        console.log(err);
      }
    })
  }

  async getPost(id: number, getThread: boolean = false){
    const headers = this.authHeader;
    return await this.http.get<Post>('http://localhost:5085/thread/post/' + id, {headers}).subscribe({
      next: res => {
        if(this.post){
          this.addComponent(res, true, getThread);
        }else{
          this.addComponent(res, false, getThread);
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

  addComponent(post: Post, incrementThreadIndex: boolean, getThread: boolean = false) {
    if(this.container) {

      const component = this.container.createComponent(ThreadcontainerComponent);

      if(component){
        component.instance.post = post;
        component.instance.component = component;
        if(getThread) {component.instance.getThread(post.id);}
        const sub: Subscription = component.instance.postDeleted.subscribe(evt => this.destroyChildThread(component));
        component.onDestroy(() => sub.unsubscribe());
        const subPop: Subscription = component.instance.popOutThreadEmitter.subscribe(evt => this.popOutThread(evt));
        component.onDestroy(() => subPop.unsubscribe());
        const subStepForward: Subscription = component.instance.stepThreadForwardEmitter.subscribe(evt => this.stepThreadForward(evt));
        component.onDestroy(() => subStepForward.unsubscribe());
        const subStepBack: Subscription = component.instance.stepThreadBackEmitter.subscribe(evt => this.stepThreadBack(evt));
        component.onDestroy(() => subStepBack.unsubscribe());
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

  destroy(){
    console.log("destroy");
    this.postDeleted.emit();
  }
  
  destroyChildThread(component: ComponentRef<ThreadcontainerComponent>){
    console.log("destroyChildThread");
    if(component){
      console.log("component not undefined");
      let index : number | undefined = this.container?.indexOf(component.hostView);
      console.log(index);
      if(index != undefined){
        this.container?.remove(index);
        console.log("remove called");
      }
    }
  }

  popOutThread(post: Post){
    console.log(post);
    this.popOutThreadEmitter.emit(post);
  }

  stepThreadForward(post: Post){
    this.stepThreadForwardEmitter.emit(post);
  }
  stepThreadBack(post: Post){
    this.stepThreadBackEmitter.emit(post);
  }
}
