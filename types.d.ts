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
interface Credit {
  adult: boolean;
  backdrop_path: string;
  character: string;
  credit_id: string;
  genre_ids: number[];
  id: number;
  media_type: "movie" | "tv";
  original_language: string;
  overview: string;
  popularity: number;
  poster_path: string;
  vote_average: number;
  vote_count: number;
}
interface TvCredit extends Credit {
  episode_count: number;
  first_air_date: string;
  name: string;
  original_name: string;
  origin_country: string[];
}
interface MovieCredit extends Credit {
  order: number;
  title: string;
  original_title: string;
  video: boolean;
  release_date: string;
}
interface People {
  adult: false;
  also_known_as: string[];
  biography: string;
  birthday: string;
  combined_credits: { cast: (TvCredit | MovieCredit)[] };
  deathday: null | string;
  gender: 1 | 2;
  homepage: null | string;
  id: number;
  imdb_id?: string;
  known_for_department: string;
  name: string;
  place_of_birth: string;
  popularity: number;
  profile_path: string;
}
