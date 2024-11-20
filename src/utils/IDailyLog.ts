export interface IDailyLog {
    id?: number; // Optional for new entries
    date: string;
    mood: number;
    anxiety: number;
    sleepHours: number;
    sleepQuality: string;
    physicalActivity?: string;
    activityDuration?: number;
    socialInteractions?: number;
    stressLevel: number;
    symptoms?: string;
  }
  