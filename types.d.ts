interface NecessaryData {
  poster: string;
  releaseDate: string;
  rating: string;
  title: string;
  id: string;
}
interface NecessaryDataPeople {
  name: string;
  role: string;
  gender: string;
  poster: string;
  id: string;
  character: string;
}
interface Video {
  id: string;
  iso_639_1: string;
  iso_3166_1: string;
  key: string;
  name: string;
  official: boolean;
  published_at: string;
  site: string;
  size: number;
  type: string;
}
interface Season {
  air_date: string;
  episode_count: number;
  id: string;
  name: string;
  overview: string;
  poster_path: string;
  season_number: number;
}
interface Episode {
  air_date: string;
  episode_number: number;
  id: string;
  name: string;
  overview: string;
  production_code: string;
  runtime: number;
  season_number: number;
  show_id: number;
  still_path: string;
  vote_average: number;
}
