import { Component, ComponentRef, EventEmitter, Input, OnInit, Output} from '@angular/core';
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
  @Output("closeDisplayEmitter") closeDisplayEmitter: EventEmitter<any> = new EventEmitter();
  @Input() isBaseDisplay: boolean = false;
  post: Post | undefined;

  componentRef: ComponentRef<ThreaddisplayComponent> | undefined;
  constructor(private http: HttpClient) {}

  

  ngOnInit(): void {}

  popOutThread(post: Post){
    console.log("pop out thread dis");
    this.popOutThreadEmitter.emit(post);
  }

  closeDisplay(){
    this.closeDisplayEmitter.emit(this.componentRef);
  }

}
