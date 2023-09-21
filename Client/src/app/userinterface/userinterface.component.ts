import { AfterViewInit, Component, ComponentRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ThreaddisplayComponent } from '../threaddisplay/threaddisplay.component';
import { Post } from '../_models/post';
import { Subscription } from 'rxjs';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-userinterface',
  templateUrl: './userinterface.component.html',
  styleUrls: ['./userinterface.component.css']
})
export class UserinterfaceComponent implements OnInit, AfterViewInit {
  @ViewChild('container', {read: ViewContainerRef}) container: ViewContainerRef | undefined;

  isMobile: boolean = false;
  constructor(private deviceDetector: DeviceDetectorService) { 
    if(this.deviceDetector.isMobile()){
      this.isMobile = true;
      console.log("IsMobile");
    }
  }

  ngAfterViewInit(): void {
    
  }

  ngOnInit(): void {
  }

  popOutThread(post: Post){
    console.log("pop out thread userint");
    this.addDisplayComponent(post);
  }
  closeDisplay(component: ComponentRef<ThreaddisplayComponent>){
    if(component){
      console.log("component not undefined");
      let index : number | undefined = this.container?.indexOf(component.hostView);
      console.log(index);
      if(index != undefined){
        this.container?.remove(index);
        console.log("remove called");
      }
    }
  }

  addDisplayComponent(post: Post) {
    if(this.container) {

      const component = this.container.createComponent(ThreaddisplayComponent);

      if(component){
        component.instance.post = post;
        component.instance.componentRef = component;
        const subPop: Subscription = component.instance.popOutThreadEmitter.subscribe((evt: Post) => this.popOutThread(evt));
        component.onDestroy(() => subPop.unsubscribe());
        const subClose: Subscription = component.instance.closeDisplayEmitter.subscribe((evt: ComponentRef<ThreaddisplayComponent>) => this.closeDisplay(evt));
        component.onDestroy(() => subPop.unsubscribe());
        component.changeDetectorRef.detectChanges();
      }
    }
  }

}
