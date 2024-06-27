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
import { IconButton, Link } from "@mui/material";
import { EditMovie } from "../components/EditMovie";
import { BackButton } from "../components/BackButton";
import { actorsService } from "../services/actors";

export function MovieDetails() {
  const user = useCurrentUser();
  const userIsAdmin = user?.tokenInfo.role === UserRole.Admin;

  const { id } = useParams();

  const navigate = useNavigate();

  const [inEditMode, setInEditMode] = useState(false);

  const {
    data: movieInfo,
    loading,
    error,
    reload,
  } = useAsync(async () => {
    if (!id) {
      throw new Error("Movie id is missing!");
    }

    const movie = await moviesService.getById(id);

    const mainStar = movie.mainStar
      ? await actorsService.getById(movie.mainStar)
      : undefined;

    return { ...movie, mainStarName: mainStar?.name };
  }, [id]);

  const releaseDate = movieInfo?.releaseDate
    ? new Date(movieInfo.releaseDate)
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

  if (loading && !movieInfo) {
    return <h1>Loading...</h1>;
  }

  if (!movieInfo && !loading && error instanceof HttpError) {
    return <h1>No movie found with id: {id}!</h1>;
  }

  if (error || deleteMovieError) {
    return <span className={classes.errorLabel}>Something went wrong!</span>;
  }

  return movieInfo && inEditMode ? (
    <EditMovie movie={movieInfo} exitEditMode={exitEditMode} />
  ) : movieInfo ? (
    <div>
      <BackButton goBack={() => navigate(-1)} />
      <div className={classes.movie}>
        <img
          src={movieInfo.poster}
          alt="Movie poster"
          className={classes.poster}
        />
        <div className={classes.movieInfo}>
          <div className={classes.editDelete}>
            <p className={classes.title}>{movieInfo.title}</p>
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
          <AddLike movie={movieInfo} onLike={reload} />
          <div className={classes.details}>
            {movieInfo.director ? <p>Director: {movieInfo.director}</p> : null}
            {movieInfo.mainStar ? (
              <p>
                Main star:{" "}
                <Link href={`/actors/${movieInfo.mainStar}`}>
                  {movieInfo.mainStarName}
                </Link>
              </p>
            ) : null}
            {movieInfo.description ? (
              <p>Description: {movieInfo.description}</p>
            ) : null}
            {releaseDate ? (
              <p>Release date: {releaseDate.toDateString()}</p>
            ) : null}
            {movieInfo.likedBy ? (
              <Likes count={movieInfo.likedBy.length} />
            ) : null}
          </div>
        </div>
      </div>
      {movieInfo.comments?.length ? (
        <CommentsSection movie={movieInfo} />
      ) : null}
      {movieInfo.reviews?.length ? <ReviewsSection movie={movieInfo} /> : null}
      <AddComment movieId={movieInfo.id} onComment={reload} />
    </div>
  ) : null;
}
