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

  postdb: PostDB;
  posts: Post[] = [];

  threadIndex: number = 0;
  constructor() {
    this.postdb = new PostDB();
    this.posts = this.postdb.posts;
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

  addComponent(post: Post, incrementThreadIndex: boolean) {
    // Create component dynamically inside the ng-template
    //const componentFactory = this.componentFactoryResolver.resolveComponentFactory(ThreadcontainerComponent);
    //const component: ComponentRef<ThreadcontainerComponent> | undefined = this.container?.createComponent(componentFactory);
    if(this.container) {
      const component = this.container.createComponent(ThreadcontainerComponent);
      console.log("hello");
      if(component)
      {
        console.log("hello fdfd");
        console.log(post.title);
        component.instance.post = post;
        if(incrementThreadIndex) {
          component.instance.threadIndex = this.threadIndex + 1;
        }
        
        component.changeDetectorRef.detectChanges();
      }
    }
    else
    {
      console.log("this.container is undefined");
    }
    
    // Push the component so that we can keep track of which components are created
    //this.components.push(component);
  }
  parentFun(){
    console.log("parentfun");
    this.loadSubPosts();
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
