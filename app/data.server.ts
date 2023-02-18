export function returnNecessaryMovieData(data: any) {
  const necessaryData = [] as NecessaryData[];
  data.results.forEach((movie: any) => {
    necessaryData.push({
      poster: movie.poster_path,
      releaseDate: movie.release_date,
      rating: Number(movie.vote_average).toFixed(1),
      title: movie.title,
      id: movie.id,
    });
  });
  return necessaryData;
}
export function returnNecessaryTvData(data: any) {
  const necessaryData = [] as NecessaryData[];
  data.results.forEach((movie: any) => {
    necessaryData.push({
      poster: movie.poster_path,
      releaseDate: movie.first_air_date,
      rating: Number(movie.vote_average).toFixed(1),
      title: movie.name,
      id: movie.id,
    });
  });
  return necessaryData;
}
