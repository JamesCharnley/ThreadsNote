import { Component, ComponentRef, EventEmitter, Input, OnInit, Output, ViewChild, ViewContainerRef} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Post } from '../_models/post';
import { ThreadcontainerComponent } from '../threadcontainer/threadcontainer.component';
@Component({
  selector: 'app-threaddisplay',
  templateUrl: './threaddisplay.component.html',
  styleUrls: ['./threaddisplay.component.css']
})
export class ThreaddisplayComponent implements OnInit {
  @ViewChild('baseThreadContainer', {read: ThreadcontainerComponent}) baseThreadContainer: ThreadcontainerComponent | undefined;
  @Output("popOutThreadEmitter") popOutThreadEmitter: EventEmitter<any> = new EventEmitter();
  @Output("closeDisplayEmitter") closeDisplayEmitter: EventEmitter<any> = new EventEmitter();
  @Input() isBaseDisplay: boolean = false;
  post: Post | undefined;

  componentRef: ComponentRef<ThreaddisplayComponent> | undefined;
  constructor(private http: HttpClient) {}

  

  ngOnInit(): void {
    
  }

  popOutThread(post: Post){
    console.log("pop out thread dis");
    this.popOutThreadEmitter.emit(post);
    
  }

  closeDisplay(){
    this.closeDisplayEmitter.emit(this.componentRef);
  }

  stepThreadForward(post: Post){
    if(this.baseThreadContainer){
      this.baseThreadContainer.removeSubposts();
      this.baseThreadContainer.post = post;
      this.baseThreadContainer.getThreadLength();
      this.baseThreadContainer.getThread(this.baseThreadContainer.post.id);
    }
  }

  stepThreadBack(post: Post){
    if(this.baseThreadContainer){
      this.baseThreadContainer.removeSubposts();
      this.baseThreadContainer.post = undefined;
      if(post.ownerPostId){
        if(post.ownerPostId != 0){
          this.baseThreadContainer.getPost(post.ownerPostId, true);
        }
      }
      else{
        this.baseThreadContainer.getThread(0);
      }
    }
  }
  

}
