export interface JwtPayload {
  phone: String;
}

export interface CreateToken {
  phone: String;
  _id: String;
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
