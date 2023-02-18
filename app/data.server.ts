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
export function returnNecessaryPeople(data: any) {
  const necessaryData = [] as NecessaryDataPeople[];

  data.results.forEach((people: any) => {
    necessaryData.push({
      name: people.name,
      role: people.known_for_department,
      gender: people.gender === 1 ? "female" : "male",
      poster: people.profile_path,
      id: people.id,
    });
  });
  return necessaryData;
}
