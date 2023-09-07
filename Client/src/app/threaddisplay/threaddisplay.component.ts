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

  constructor(private http: HttpClient) {}

  ngOnInit(): void {}

}
