import { User, UserRole, Event, Reward } from './types';

export const CURRENT_USER: User = {
  id: 'u1',
  name: 'Alwyn Reji',
  role: UserRole.STUDENT,
  avatar: 'https://media.licdn.com/dms/image/v2/D5603AQFLBKeT04cvow/profile-displayphoto-crop_800_800/B56ZhfrHJnG0AY-/0/1753951794936?e=1772064000&v=beta&t=x9y09SuH18UOa1hS7H0e4txFvDCBgjcOwDcKyaQlt94',
  totalCredits: 1250,
  rank: 4,
  skills: {
    leadership: 85,
    creativity: 60,
    teamwork: 90,
    technical: 75,
    communication: 70
  }
};

export const LEADERBOARD_DATA: User[] = [
  { ...CURRENT_USER, id: 'u2', name: 'Abhirami Mohan', totalCredits: 1540, rank: 1, avatar: 'https://media.licdn.com/dms/image/v2/D5603AQFEA5HfLlPMtg/profile-displayphoto-crop_800_800/B56ZgR3kDLHMAI-/0/1752646436903?e=1772064000&v=beta&t=8Quo5t0EZTIc6EALA1X9imqVbXXErd4jRwLCriGpQOQ', skills: { leadership: 90, creativity: 85, teamwork: 95, technical: 92, communication: 88 } },
  { ...CURRENT_USER, id: 'u3', name: 'Augen George', totalCredits: 1420, rank: 2, avatar: 'https://media.licdn.com/dms/image/v2/D5603AQEiJwR_NKbjTw/profile-displayphoto-crop_800_800/B56ZlQ4EMLJwAI-/0/1757998502584?e=1772064000&v=beta&t=nHPfh7507ykNRSxGxdsZCDq8O9v4CKd9zEu3lKOD5OA', skills: { leadership: 88, creativity: 70, teamwork: 85, technical: 95, communication: 75 } },
  { ...CURRENT_USER, id: 'u4', name: 'Ron Thomas', totalCredits: 1350, rank: 3, avatar: 'https://media.licdn.com/dms/image/v2/D5603AQFxx50tPRM51w/profile-displayphoto-crop_800_800/B56ZgIDJYUHQAQ-/0/1752481701248?e=1772064000&v=beta&t=Ov_wamRf_b5D45oLfqNTJZjOSlMqimsDNJ0Lzfkut3g', skills: { leadership: 95, creativity: 60, teamwork: 80, technical: 65, communication: 95 } },
  CURRENT_USER,
  { ...CURRENT_USER, id: 'u5', name: 'Farhan PY', totalCredits: 1100, rank: 5, avatar: 'https://media.licdn.com/dms/image/v2/D5603AQHA8pb-Gzt6_w/profile-displayphoto-crop_800_800/B56Zu62XO1HcAM-/0/1768366372706?e=1772064000&v=beta&t=NhLVcMsTR1uAmSLT12JNF6X0lMZo9kureOpNNy2wJfI', skills: { leadership: 60, creativity: 50, teamwork: 60, technical: 98, communication: 65 } },
];

export const EVENTS: Event[] = [
  {
    id: 'e1',
    title: 'AI Innovation Hackathon',
    date: '2024-06-15',
    category: 'Hackathon',
    credits: 100,
    status: 'Upcoming',
    image: 'https://picsum.photos/id/2/600/400',
    description: 'Build the future of AI in this 24-hour intense coding marathon.'
  },
  {
    id: 'e2',
    title: 'Leadership Summit',
    date: '2024-05-20',
    category: 'Seminar',
    credits: 50,
    status: 'Verified',
    image: 'https://picsum.photos/id/3/600/400',
    description: 'Learn from industry leaders about managing teams effectively.'
  },
  {
    id: 'e3',
    title: 'Creative Writing Workshop',
    date: '2024-05-10',
    category: 'Workshop',
    credits: 30,
    status: 'Verified',
    image: 'https://picsum.photos/id/4/600/400',
    description: 'Unleash your inner storyteller.'
  },
  {
    id: 'e4',
    title: 'Robotics Club Meetup',
    date: '2024-06-22',
    category: 'Club Activity',
    credits: 20,
    status: 'Upcoming',
    image: 'https://picsum.photos/id/6/600/400',
    description: 'Weekly meetup to work on the Mars Rover project.'
  }
];

export const REWARDS: Reward[] = [
  { id: 'r1', name: 'University Hoodie', cost: 500, category: 'Merch', description: 'Premium cotton hoodie with logo.', image: 'https://picsum.photos/id/18/300/300' },
  { id: 'r2', name: 'Food Lab', cost: 100, category: 'Voucher', description: '$10 cafeteria voucher.', image: 'https://t4.ftcdn.net/jpg/02/74/99/21/360_F_274992194_1MDSPiaalQe5Rx26IotuQ0j4TieiMROE.jpg' },
  { id: 'r3', name: 'Extra Lab Access', cost: 300, category: 'Academic', description: '24/7 Access to the innovation lab for a week.', image: 'https://picsum.photos/id/26/300/300' },
  { id: 'r4', name: 'Conference Ticket', cost: 1000, category: 'Academic', description: 'Full access to the annual TechConf.', image: 'https://picsum.photos/id/30/300/300' },
];