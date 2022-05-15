export interface UserDTO {
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  password: string;
  readonly status: boolean;
  readonly createdAt: Date;
}