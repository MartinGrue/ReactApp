export interface IProfile {
  displayName: string;
  bio: string;
  userName: string;
  image: string;
  photos: IPhoto[];
  isFollowed?: boolean;
  followersCount: number;
  followingCount: number;
}
export interface IPhoto {
  id: string;
  url: string;
  isMain: boolean;
}
export interface IProfileFormValues {
  bio?: string;
  displayName: string;
}
export interface IProfileForFollowerOrFollowing {
  displayName: string;
  bio: string;
  userName: string;
  image: string;
  followersCount: number;
  followingCount: number;
}
