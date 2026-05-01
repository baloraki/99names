export type LearningScheduleSettings = {
  enabled: boolean;
  interval: '2h' | '6h' | 'daily';
  lastCompletedAt?: string;
  nextDueAt?: string;
}
