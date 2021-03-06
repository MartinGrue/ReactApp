export interface IUser {
  displayName: string;
  userName: string;
  token: string;
  image: string | null;
}

export interface IUserFormValues{
    email:string;
    password:string;
    displayName?: string;
    userName?: string;
}
export interface IExternalLoginInfo{
  provider:string;
  token:string;
}