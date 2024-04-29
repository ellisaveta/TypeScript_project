import { useParams } from "react-router";
import { useAsync } from "../hooks/useAsync";
import { moviesService } from "../services/movies";
import classes from "../pages/MovieDetails.module.css";
import { Likes } from "../components/Likes";
import { CommentsSection } from "../components/CommentsSection";
import { ReviewsSection } from "../components/ReviewsSection";
import { AddComment } from "../components/AddComment";
import { AddLike } from "../components/AddLike";
import { HttpError } from "../services/http";

export function MovieDetails() {
  const { id } = useParams();
  const {
    data: movie,
    loading,
    error,
    reload,
  } = useAsync(() => moviesService.getById(Number(id)), [id]);
  if (loading && !movie) {
    return <h1>Loading...</h1>;
  }
  if (!movie && !loading && error instanceof HttpError) {
    return <h1>No movie found with id: {id}!</h1>;
  }

  const releaseDate = movie?.releaseDate
    ? new Date(movie.releaseDate)
    : undefined;
  return movie ? (
    <div className={classes.root}>
      <div className={classes.movie}>
        <img src={movie.poster} alt="Movie poster" className={classes.poster} />
        <div className={classes.movieInfo}>
          <p className={classes.title}>{movie.title}</p>
          <AddLike movie={movie} onLike={reload} />
          <div className={classes.details}>
            {movie.director ? <p>Director: {movie.director}</p> : null}
            {movie.mainStar ? <p>Main star: {movie.mainStar}</p> : null}
            {movie.description ? <p>Description: {movie.description}</p> : null}
            {releaseDate ? (
              <p>Release date: {releaseDate.toDateString()}</p>
            ) : null}
            {movie.likedBy ? <Likes count={movie.likedBy.length} /> : null}
          </div>
        </div>
      </div>
      {movie.comments?.length ? <CommentsSection movie={movie} /> : null}
      {movie.reviews?.length ? <ReviewsSection movie={movie} /> : null}
      <AddComment movieId={movie.id} onComment={reload} />
    </div>
  ) : error ? (
    <span className={classes.errorLabel}>Something went wrong!</span>
  ) : null;
}
