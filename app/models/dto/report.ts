export interface ReportDTO {
  userId: string;
  projectId: string;
  readonly dedication: {
    hours: number;
    minutes: number;
  };
  weekNumber: number;
  readonly status: boolean;
  readonly createdAt: Date;
}
