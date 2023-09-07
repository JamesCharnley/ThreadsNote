import { Component, Input, OnInit, ViewChild, ViewContainerRef, ComponentRef, AfterContentInit, AfterViewInit} from '@angular/core';
import { Post } from 'src/app/_models/post';
import { PostDB } from '../_testing/postDB';

@Component({
  selector: 'app-threadcontainer',
  templateUrl: './threadcontainer.component.html',
  styleUrls: ['./threadcontainer.component.css']
})
export class ThreadcontainerComponent implements OnInit, AfterViewInit {

  @Input() post: Post | undefined;
  @ViewChild('container', {read: ViewContainerRef}) container: ViewContainerRef | undefined;

  isExpaned: boolean = false;

  postdb: PostDB; // temp fake db
  posts: Post[] = []; // temp fake db

  threadIndex: number = 0; // TODO: change to bool isSubPost

  constructor() {
    this.postdb = new PostDB(); // temp fake db
    this.posts = this.postdb.posts; // temp fake db
  }
  ngAfterViewInit(): void {
    if(this.post == undefined)
    {
      this.loadPosts();
    }
  }

  ngAfterContentInit(): void {
    
  }

  ngOnInit(): void {
    
  }

  loadPosts()
  {
    this.posts.forEach(post => {
      if(!post.ownerPost) {
        this.addComponent(post, false);
      }
    });
  }
  
  loadSubPosts() {
    this.posts.forEach(post => {
      if(post.ownerPost) {
        if(post.ownerPost == this.post?.id) {
          this.addComponent(post, true);
        }
      }
    });
  }
  removeSubposts(){
    this.container?.clear();
  }
  addComponent(post: Post, incrementThreadIndex: boolean) {

    if(this.container) {

      const component = this.container.createComponent(ThreadcontainerComponent);

      if(component)
      {
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
      // remove subposts
      this.removeSubposts();
      this.isExpaned = false;
    }
    else
    {
      // add subposts
      this.loadSubPosts();
      this.isExpaned = true;
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
