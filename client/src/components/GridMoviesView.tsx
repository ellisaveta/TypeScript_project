import { MoviesLibraryProps } from "../pages/MoviesLibrary";
import classes from "./GridMoviesView.module.css";
import { MovieGridBox } from "./MovieGridBox";

export function GridMoviesView({ movies }: MoviesLibraryProps) {
  return (
    <div className={classes.grid}>
      {movies.map((movie) => (
        <MovieGridBox key={movie.title} movie={movie} />
      ))}
    </div>
  );
}
