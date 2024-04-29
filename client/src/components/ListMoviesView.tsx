import { MoviesLibraryProps } from "../pages/MoviesLibrary";
import classes from "./ListMoviesView.module.css";
import { MovieListItem } from "./MovieListItem";

export function ListMoviesView({ movies }: MoviesLibraryProps) {
  return (
    <div className={classes.list}>
      {movies.map((movie) => (
        <MovieListItem key={movie.title} movie={movie} />
      ))}
    </div>
  );
}
