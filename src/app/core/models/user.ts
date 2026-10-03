export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  image: string;
}

export interface Credentials {
  username: string;
  password: string;
}

// DummyJSON devuelve los datos del usuario junto con los tokens.
export interface LoginResponse extends User {
  accessToken: string;
  refreshToken: string;
}
