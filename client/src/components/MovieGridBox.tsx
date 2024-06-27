import { Link } from "react-router-dom";
import { MovieModel } from "../services/movies";
import classes from "./MovieGridBox.module.css";
import { useAsync } from "../hooks/useAsync";
import { actorsService } from "../services/actors";

interface MovieGridBoxProps {
  movie: MovieModel;
}

export function MovieGridBox({ movie }: MovieGridBoxProps) {
  const releaseDate = movie.releaseDate
    ? new Date(movie.releaseDate)
    : undefined;

  const { data: mainStarName } = useAsync(async () => {
    if (!movie.mainStar) {
      return;
    }

    return (await actorsService.getById(movie.mainStar)).name;
  }, [movie.mainStar]);

  return (
    <Link to={`/movies/${movie.id}`}>
      <div className={classes.card}>
        <p className={classes.title}>{movie.title}</p>
        {movie.director ? <p>Director: {movie.director}</p> : null}
        {mainStarName ? <p>Main star: {mainStarName}</p> : null}
        {movie.description ? <p>Description: {movie.description}</p> : null}
        {releaseDate ? <p>Release date: {releaseDate.toDateString()}</p> : null}
      </div>
    </Link>
  );
}
