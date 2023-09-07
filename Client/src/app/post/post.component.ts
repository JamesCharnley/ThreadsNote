import { Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { Post } from 'src/app/_models/post';
import { PostDB } from 'src/app/_testing/postDB';
@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {
  
  @Input() post: Post | undefined;
  @Output("expandToggle") expandToggle: EventEmitter<any> = new EventEmitter();

  postdb: PostDB; // temp fake db
  posts: Post[] = []; // temp fake db

  constructor() { 
    this.postdb = new PostDB(); // temp fake db
    this.posts = this.postdb.posts; // temp fake db
  }

  ngOnInit(): void {
  }

  expandTogglePressed() // user clicked expand post to open sub posts
  {
    this.expandToggle.emit(); // emit function call to parent (ThreadContainerComponent)
  }

}
