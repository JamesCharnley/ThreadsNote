import { Component, Input, OnInit} from '@angular/core';
import { Post } from 'src/app/_models/post';
import { PostDB } from 'src/app/_testing/postDB';
@Component({
  selector: 'app-threaddisplay',
  templateUrl: './threaddisplay.component.html',
  styleUrls: ['./threaddisplay.component.css']
})
export class ThreaddisplayComponent implements OnInit {
  postdb: PostDB;
  posts: Post[] = [];
  constructor() { 
    this.postdb = new PostDB();
    this.posts = this.postdb.posts;
  }

  ngOnInit(): void {
  }

}
