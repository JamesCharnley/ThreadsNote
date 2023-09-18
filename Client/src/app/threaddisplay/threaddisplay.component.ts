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

  setBaseContainer(ownerThreadContainer: ComponentRef<ThreadcontainerComponent>){
    if(this.baseThreadContainer){
      this.baseThreadContainer.removeSubposts();
      this.baseThreadContainer.post = ownerThreadContainer.instance.post;
      this.baseThreadContainer.threadLength = ownerThreadContainer.instance.threadLength;
      this.baseThreadContainer.subPosts = ownerThreadContainer.instance.subPosts;
    }
  }

}
