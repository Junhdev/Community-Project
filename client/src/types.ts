export interface User {
    id: number;
    userID: string;
    username: string;
    email: string;
    profileImg: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface Community {
    createdAt: string;
    updatedAt: string;
    name: string;
    title: string;
    description: string;
    imageUrn: string;
    bannerUrn: string;
    username: string;
    posts: Post[];
    postCount?: string;
  
    imageUrl: string;
    bannerUrl: string;
  }
  
  export interface Post {
    identifier: string;
    title: string;
    slug: string;
    body: string;
    communityname: string;
    username: string;
    createdAt: string;
    updatedAt: string;
    community?: Community;
  
    url: string;
    userLike?: number;
    likeScore?: number;
    commentCount?: number;
  }
  
  export interface Comment {
    identifier: string;
    body: string;
    username: string;
    createdAt: string;
    updatedAt: string;
    post?: Post;
  
    userLike: number;
    likeScore: number;
  }
  
  export interface FriendShip {
    sender_id: number;
    receiver_id: number;
    accepted: boolean;
    createdAt: string;
    updatedAt: string;
    user_id: string;
  }


  export interface ModalProps {
    component: JSX.Element;
    zIndex: number;
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
    transform?: string;
    dimmedBorderRadius?: string;
    handleDimmedClick: React.MouseEventHandler;
  }

  type FreindRequestAction = 'accept' | 'deny';