import { FormEvent, useState } from "react";
import { Button } from "./Button";
import classes from "./AddLike.module.css";
import { useAsyncAction } from "../hooks/useAsyncAction";
import { MovieModel, moviesService } from "../services/movies";
import { useCurrentUser } from "../contexts/CurrentUserContext";

interface AddLikeProps {
  movie: MovieModel;
  onLike: () => void;
}

export function IsMovieLikedByCurrentUser(movie: MovieModel) {
  const user = useCurrentUser();
  if (movie.likedBy && user) {
    return (
      movie.likedBy?.map((user) => user.id).indexOf(user.tokenInfo.id) > -1
    );
  }
  return false;
}

export function AddLike({ movie, onLike }: AddLikeProps) {
  const [isLiked, setIsLiked] = useState<boolean>(
    IsMovieLikedByCurrentUser(movie)
  );

  const { trigger, error } = useAsyncAction(async (event: FormEvent) => {
    event.preventDefault();

    await moviesService.addLike(movie.id);

    setIsLiked(!isLiked);
    onLike();
  });

  return (
    <>
      <Button
        className={isLiked ? classes.likedButton : classes.likeButton}
        onClick={trigger}
      >
        <img
          src="/heart-empty.svg"
          alt="Like icon before like"
          className={classes.emptyHeart}
        />
        <img
          src="/heart-full.svg"
          alt="Like icon after like"
          className={classes.fullHeart}
        />
      </Button>
      {!!error && (
        <span className={classes.errorLabel}>Something went wrong!</span>
      )}
    </>
  );
}
