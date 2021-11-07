export interface JwtPayload {
  username: string;
}

export interface CreateToken {
  username: string;
  type: tokenType;
}

export enum tokenType {
  RefreshToken = 'refreshToken',
  AccessToken = 'accessToken',
}

export enum Role {
  guest= 'guest',
  user= 'user,'
}
