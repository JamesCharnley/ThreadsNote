import { AfterViewInit, Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ThreaddisplayComponent } from '../threaddisplay/threaddisplay.component';
import { Post } from '../_models/post';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-userinterface',
  templateUrl: './userinterface.component.html',
  styleUrls: ['./userinterface.component.css']
})
export class UserinterfaceComponent implements OnInit, AfterViewInit {
  @ViewChild('container', {read: ViewContainerRef}) container: ViewContainerRef | undefined;

  constructor() { }

  ngAfterViewInit(): void {
    
  }

  ngOnInit(): void {
  }

  popOutThread(post: Post){
    console.log("pop out thread userint");
    this.addDisplayComponent(post);
  }

  addDisplayComponent(post: Post) {
    if(this.container) {

      const component = this.container.createComponent(ThreaddisplayComponent);

      if(component){
        component.instance.post = post;
        const subPop: Subscription = component.instance.popOutThreadEmitter.subscribe(evt => this.popOutThread(evt));
        component.onDestroy(() => subPop.unsubscribe());
        component.changeDetectorRef.detectChanges();
      }
    }
  }

}
