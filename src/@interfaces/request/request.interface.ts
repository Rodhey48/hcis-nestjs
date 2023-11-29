export interface RequestInterface {
    user: UserLoggedInterface
}

export interface UserLoggedInterface {
    id: string,
    email: string,
    name: string,
    username: string,
    // role?: { [key: string]: string | number | Array<string> | Array<number> } ,
    role?: any;
}