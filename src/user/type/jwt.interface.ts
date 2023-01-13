export interface JwtPayload {
  phone: string;
}

export interface CreateToken {
  phone: string;
  _id: string;
  type: tokenType;
}

export enum tokenType {
  RefreshToken = 'refreshToken',
  AccessToken = 'accessToken',
}

export enum Role {
  guest = 'guest',
  user = 'user',
}
