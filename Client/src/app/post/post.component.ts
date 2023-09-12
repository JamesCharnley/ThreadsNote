import { Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { Post } from 'src/app/_models/post';

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


  constructor() { 

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
  
}
