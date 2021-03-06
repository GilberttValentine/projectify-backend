export interface UserDTO {
  readonly _id: string;
  readonly names: string;
  readonly lastNames: string;
  readonly email: string;
  password: string;
  readonly status: boolean;
  readonly createdAt: Date;
}