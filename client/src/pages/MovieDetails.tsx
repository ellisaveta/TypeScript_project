import { useNavigate, useParams } from "react-router";
import { useAsync } from "../hooks/useAsync";
import { moviesService } from "../services/movies";
import classes from "../pages/MovieDetails.module.css";
import { Likes } from "../components/Likes";
import { CommentsSection } from "../components/CommentsSection";
import { ReviewsSection } from "../components/ReviewsSection";
import { AddComment } from "../components/AddComment";
import { AddLike } from "../components/AddLike";
import { HttpError } from "../services/http";
import { useCurrentUser } from "../contexts/CurrentUserContext";
import { UserRole } from "../services/userInfoStorage";
import { DeleteForever, Edit } from "@mui/icons-material";
import { useCallback, useState } from "react";
import { useAsyncAction } from "../hooks/useAsyncAction";
import { IconButton } from "@mui/material";
import { EditMovie } from "../components/EditMovie";
import { BackButton } from "../components/BackButton";

export function MovieDetails() {
  const user = useCurrentUser();
  const userIsAdmin = user?.tokenInfo.role === UserRole.Admin;

  const { id } = useParams();

  const navigate = useNavigate();

  const [inEditMode, setInEditMode] = useState(false);

  const {
    data: movie,
    loading,
    error,
    reload,
  } = useAsync(() => {
    if (!id) {
      throw new Error("Movie id is missing!");
    }
    return moviesService.getById(id);
  }, [id]);

  const releaseDate = movie?.releaseDate
    ? new Date(movie.releaseDate)
    : undefined;

  const onEdit = useCallback(() => {
    setInEditMode(true);
  }, []);

  const exitEditMode = useCallback(() => {
    setInEditMode(false);
    reload();
  }, []);

  const { error: deleteMovieError, trigger: deleteMovie } = useAsyncAction(
    async () => {
      if (!id) {
        throw new Error("Movie id is missing!");
      }

      const movie = await moviesService.deleteMovie(id);

      navigate(`/movies`);
      return movie;
    }
  );

  if (loading && !movie) {
    return <h1>Loading...</h1>;
  }

  if (!movie && !loading && error instanceof HttpError) {
    return <h1>No movie found with id: {id}!</h1>;
  }

  if (error || deleteMovieError) {
    return <span className={classes.errorLabel}>Something went wrong!</span>;
  }

  return movie && inEditMode ? (
    <EditMovie movie={movie} exitEditMode={exitEditMode} />
  ) : movie ? (
    <div>
      <BackButton goBack={() => navigate(-1)} />
      <div className={classes.movie}>
        <img src={movie.poster} alt="Movie poster" className={classes.poster} />
        <div className={classes.movieInfo}>
          <div className={classes.editDelete}>
            <p className={classes.title}>{movie.title}</p>
            {userIsAdmin ? (
              <>
                <IconButton onClick={onEdit}>
                  <Edit />
                </IconButton>
                <IconButton onClick={deleteMovie}>
                  <DeleteForever color="error" />
                </IconButton>
              </>
            ) : null}
          </div>
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
  ) : null;
}
