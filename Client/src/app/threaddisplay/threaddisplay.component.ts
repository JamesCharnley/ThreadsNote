import { Component, Input, OnInit} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Post } from 'src/app/_models/post';
import { PostDB } from 'src/app/_testing/postDB';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-threaddisplay',
  templateUrl: './threaddisplay.component.html',
  styleUrls: ['./threaddisplay.component.css']
})
export class ThreaddisplayComponent implements OnInit {
  postdb: PostDB;
  posts: Post[] = [];
  constructor(private http: HttpClient) { 
    this.postdb = new PostDB();
    this.posts = this.postdb.posts;
  }

  ngOnInit(): void {
    let b: Observable<Blob> = this.getImageh();
    
  }
  getImage()
  {
    this.http.get('http://localhost:5085/' + 'Image').subscribe({
      next: res => console.log("Received response"),
      error: err => console.log(err)
    })
  }
  getImageh(): Observable<Blob> {
    return this.http.get('http://localhost:5085/' + 'Image', { responseType: 'blob' });
  }
}
