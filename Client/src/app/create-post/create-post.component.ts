import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PostForm } from '../_models/postForm';
import { FileUploader } from 'ng2-file-upload';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';
import { AccountService } from '../_services/account.service';
import { take } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Post } from '../_models/post';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent implements OnInit {
  @Input() post: Post | undefined;
  @Output("cancelCreatePost") cancelCreatePost: EventEmitter<any> = new EventEmitter();
  @Output("newPostCreated") newPostCreated: EventEmitter<any> = new EventEmitter();
  

  model: any = {};
  uploader: FileUploader | undefined;
  hasBaseDropZoneOver = false;
  baseUrl = environment.apiUrl;
  user: User | undefined;
  totalImages: number = 0;

  createdPostId: number = 0;

  authHeader = {'Authorization': ''};
  
  constructor(private accountService: AccountService, private http: HttpClient) { 
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: user => {
        if(user) {
          this.user = user;
          this.authHeader.Authorization = 'Bearer ' + user.token;
        }
      }
    })
  }

  ngOnInit(): void {
    if(this.post){
      this.model.ownerPost = this.post.id;
    }
    else{
      this.model.ownerPost = 0;
    }
    this.initializeUploader();
  }

  fileOverBase(e: any) {
    this.hasBaseDropZoneOver = e;
  }

  initializeUploader() {
    this.uploader = new FileUploader({
      url: this.baseUrl + 'thread/add-photo/1',
      authToken: 'Bearer ' + this.user?.token,
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024
    });

    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    }

    this.uploader.onSuccessItem = (item, response, status, headers) => {
      if(response) {
        this.totalImages -= 1;
        if(this.totalImages == 0) {
          console.log("All images uploaded. Post completed successfully");
          this.displayNewPost(this.createdPostId);
        }else{
          console.log("Image uploaded. " + this.totalImages + " uploads in progress"); // we may want to change this to recieve post
        }
      }
    }
  }

  submitPost() {
    console.log(this.model);
    const headers = this.authHeader;
    return this.http.post<number>(this.baseUrl + 'thread/add-post', this.model, {headers}).pipe().subscribe({
      next: res => this.uploadImages(res),
      error: err => console.log(err)
    })
  }
  uploadImages(postId: number) {
    this.createdPostId = postId;
    if(this.uploader?.queue) {
      this.totalImages = this.uploader.queue.length;
      if(this.totalImages < 1) {
        console.log("No images in queue: Post upload completed successfully");
        this.displayNewPost(this.createdPostId);
        return;
      }
    }

    this.uploader?.setOptions({
      url: this.baseUrl + 'thread/add-photo/' + postId
    });
    this.uploader?.uploadAll();
  }

  cancelAddPost(){
    this.cancelCreatePost.emit();
  }

  displayNewPost(id: number){
    this.newPostCreated.emit(id);
    this.cancelAddPost();
  }
}
