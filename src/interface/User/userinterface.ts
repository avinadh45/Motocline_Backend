
export interface   IUserProfile{
    image?: string;
}

export interface IUser {
    _id: string;
    name:string;
    email:string;
    role: "user" | "serviceCenter" | "admin" | "mechanic";
    phoneNumber: string;
    password:string;
    userProfile?: IUserProfile;
    isVerified?: boolean;
    isBlocked?:boolean;
    resetToken?: string;
    resetTokenExpiry?: Date;
    createdAt?:Date;
    updateAt?:Date;
}
