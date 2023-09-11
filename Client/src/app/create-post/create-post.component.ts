import { Component, OnInit } from '@angular/core';
import { PostForm } from '../_models/postForm';
import { FileUploader } from 'ng2-file-upload';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';
import { AccountService } from '../_services/account.service';
import { take } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent implements OnInit {
  model: any = {};
  uploader: FileUploader | undefined;
  hasBaseDropZoneOver = false;
  baseUrl = 'http://localhost:5085/';
  user: User | undefined;
  postId: number | undefined;
  
  constructor(private accountService: AccountService, private http: HttpClient) { 
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: user => {
        if(user) this.user = user
      }
    })
  }

  ngOnInit(): void {
    this.model.ownerPost = 0;
    this.initializeUploader();
  }

  fileOverBase(e: any) {
    this.hasBaseDropZoneOver = e;
  }

  initializeUploader() {
    this.uploader = new FileUploader({
      url: this.baseUrl + 'users/add-photo/1',
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
        console.log("Images uploaded: Post upload completed successfully"); // we may want to change this to recieve post
      }
    }
  }

  submitPost() {
    const headers = { 'Authorization': 'Bearer ' + this.user?.token};
    return this.http.post<number>(this.baseUrl + 'users/add-post', this.model, {headers}).pipe().subscribe({
      next: res => this.uploadImages(res),
      error: err => console.log(err)
    })
    //this.uploader?.uploadAll();
  }
  uploadImages(postId: number) {
    if(this.uploader?.queue) {
      if(this.uploader.queue.length < 1) {
        console.log("No images in queue: Post upload completed successfully");
        return;
      }
    }
    this.postId = postId;
    this.uploader?.setOptions({
      url: this.baseUrl + 'users/add-photo/' + postId
    });
    this.uploader?.uploadAll();
  }

}
