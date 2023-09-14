import { Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Post } from '../_models/post';
@Component({
  selector: 'app-threaddisplay',
  templateUrl: './threaddisplay.component.html',
  styleUrls: ['./threaddisplay.component.css']
})
export class ThreaddisplayComponent implements OnInit {
  @Output("popOutThreadEmitter") popOutThreadEmitter: EventEmitter<any> = new EventEmitter();
  
  post: Post | undefined;
  constructor(private http: HttpClient) {}

  ngOnInit(): void {}

  popOutThread(post: Post){
    console.log("pop out thread dis");
    this.popOutThreadEmitter.emit(post);
  }

}
