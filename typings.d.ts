/* Account */

interface User {
  email: string;
  hash: string;
}

interface UserInput {
  email: string;
  password: string;
}

interface AccountResponse {
  success: boolean;
  errors: string[];
  token?: string;
}

/* Cinema */

interface Schedule {
  id: number;
  hour: string;
}

interface Session {
  id: number;
  schedules: Schedule[];
  movieId: number;
  theaterId: number;
  movie?: Movie;
  theater?: Theater;
}

interface Movie {
  id: number;
  title: string;
  category: string;
  categoryId: number;
  summary: string;
  releasedDate: string;
  image: {
    src: string;
  };
  video: {
    youtube: string;
  };
  sessions?: Session[];
  sessionsIds?: number[];
}

interface Category {
  id: number;
  title: string;
}

interface Theater {
  id: number;
  title: string;
  address: string;
  logo: {
    src: string;
  };
  sessions?: Session[];
  sessionsIds?: number[];
}

interface Reservation {
  id: number;
  movieTitle: string;
  theaterTitle: string;
  scheduleId: number;
  scheduleHour: string;
}

interface Slide {
  id: number;
  imgSrc: string;
  imgSrcFull: string;
  imgAlt: string;
}
