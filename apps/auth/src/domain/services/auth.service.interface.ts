export interface IAuthExecuter<Response, Credentials = void> {
  login(credentials: Credentials): Promise<Response>;
  logout(userId: string): Promise<void>;
}

export interface IAuthRegister<Response, UserData = void> {
  register(userData: UserData): Promise<Response>;
}

export interface IAuthTokenizer<Token, Result = boolean | object> {
  validateToken(token: Token): Promise<Result>;
  refreshToken(refreshToken: Token): Promise<Result>;
}
