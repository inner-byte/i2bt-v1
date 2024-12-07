export interface Workshop {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  duration: string;
  instructor: {
    name: string;
    role: string;
    avatar: string;
  };
  skillLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  maxParticipants: number;
  currentParticipants: number;
  prerequisites: string[];
  thumbnail: string;
  tags: string[];
  isRegistered?: boolean;
  hasReminder?: boolean;
}
