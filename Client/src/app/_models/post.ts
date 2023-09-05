

export interface Post {
    id: number,
    title: string,
    text: string,
    imageUrl: string,
    subPosts: number,
    ownerPost: number | undefined
}