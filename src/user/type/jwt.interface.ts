export interface JwtPayload {
  username: String;
}

export interface CreateToken {
  username: String;
  phone: String;
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
