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
  postdb: PostDB;
  posts: Post[] = [];
  constructor() { 
    this.postdb = new PostDB();
    this.posts = this.postdb.posts;
  }


  ngOnInit(): void {
  }

  expandTogglePressed()
  {
    console.log("clicked");
    this.expandToggle.emit();
  }
  

}
