import { Post } from 'src/app/_models/post';

export class PostDB {
    posts: Post[] = [
        {"id": 1, "title": "post1", "text": "This is the first post in a thread", "imageUrl": "https://i.imgur.com/bA0BzTN.jpg", "subPosts": 1, "ownerPost": undefined},
        {"id": 2, "title": "subpost1 of post1", "text": "This is the first subpost of post1", "imageUrl": "https://i.imgur.com/bA0BzTN.jpg", "subPosts": 1, "ownerPost": 1},
        {"id": 3, "title": "subpost2 of post1", "text": "This is the second subpost of post1", "imageUrl": "https://i.imgur.com/bA0BzTN.jpg", "subPosts": 0, "ownerPost": 1},
        {"id": 4, "title": "subpost1 of subpost1 of post1", "text": "This is the first subpost of subpost1 of post1", "imageUrl": "https://i.imgur.com/bA0BzTN.jpg", "subPosts": 0, "ownerPost": 2}
    ];

    constructor() { }
}