import { Link } from "react-router-dom";
import { MovieModel } from "../services/movies";
import classes from "./MovieGridBox.module.css";

interface MovieGridBoxProps {
  movie: MovieModel;
}

export function MovieGridBox({ movie }: MovieGridBoxProps) {
  const releaseDate = movie.releaseDate
    ? new Date(movie.releaseDate)
    : undefined;

  return (
    <Link to={`/movies/${movie.id}`}>
      <div className={classes.card}>
        <p className={classes.title}>{movie.title}</p>
        {movie.director ? <p>Director: {movie.director}</p> : null}
        {movie.mainStar ? <p>Main star: {movie.mainStar}</p> : null}
        {movie.description ? <p>Description: {movie.description}</p> : null}
        {releaseDate ? <p>Release date: {releaseDate.toDateString()}</p> : null}
      </div>
    </Link>
  );
}
