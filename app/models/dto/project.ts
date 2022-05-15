export interface ProjectDTO {
  readonly name: string;
  readonly description: string;
  readonly reports: [];
  readonly status: boolean;
  readonly createdAt: Date;
}
