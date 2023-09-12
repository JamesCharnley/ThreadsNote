import { Photo } from "./photo";

export interface Post {
    id: number,
    title: string,
    contentText: string,
    photos: Photo[],
    ownerPostId: number | undefined
}