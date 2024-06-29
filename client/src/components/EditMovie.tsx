import { FormEvent, useEffect, useState } from "react";
import { useAsyncAction } from "../hooks/useAsyncAction";
import { InputMovieModel, MovieModel, moviesService } from "../services/movies";
import { FormLayout } from "../layouts/FormLayout";
import classes from "./EditMovie.module.css";
import { Input } from "./Input";
import { fieldErrors } from "../lib/fieldError";
import { HttpError } from "../services/http";
import { Button } from "./Button";
import { DateField, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { MainStarInput } from "./MainStarInput";
import { useAsync } from "../hooks/useAsync";
import { actorsService } from "../services/actors";
import { omit } from "lodash";

interface Props {
  movie: MovieModel;
  exitEditMode: () => void;
}

export function EditMovie({ movie, exitEditMode }: Props) {
  const { data: initialActor } = useAsync(
    async () =>
      movie.mainStar ? actorsService.getById(movie.mainStar) : undefined,
    [movie.mainStar]
  );

  const [input, setInput] = useState<InputMovieModel>({
    ...omit(movie, ["mainStar", "releaseDate"]),
    mainStar: null,
    releaseDate: movie.releaseDate ? dayjs(movie.releaseDate) : null,
  });

  useEffect(
    () =>
      setInput((current) => ({
        ...omit(current, "mainStar"),
        mainStar: initialActor
          ? { name: initialActor?.name, id: initialActor?.id }
          : null,
      })),
    [initialActor]
  );

  const {
    loading,
    error,
    trigger: editMovie,
  } = useAsyncAction(async (event: FormEvent) => {
    event.preventDefault();

    const editedMovie = await moviesService.editMovie(movie.id, {
      ...input,
      title: input.title !== "" ? input.title : undefined,
      director: input.director !== "" ? input.director : undefined,
      description: input.description !== "" ? input.description : undefined,
      poster: input.poster !== "" ? input.poster : undefined,
    });

    exitEditMode();

    return editedMovie;
  });

  return (
    <FormLayout>
      <h1>Edit movie</h1>
      <form className={classes.form}>
        <div className={classes.group}>
          <label htmlFor="title" className={classes.label}>
            Title:{" "}
          </label>
          <Input
            type="text"
            id="title"
            errors={fieldErrors(error, "title")}
            value={input.title ?? ""}
            onChange={(value) => setInput({ ...input, title: value })}
          />
        </div>
        <div className={classes.group}>
          <label htmlFor="director" className={classes.label}>
            Director:{" "}
          </label>
          <Input
            type="text"
            id="director"
            errors={fieldErrors(error, "director")}
            value={input.director ?? ""}
            onChange={(value) => setInput({ ...input, director: value })}
          />
        </div>
        <div className={classes.group}>
          <label htmlFor="mainStar" className={classes.label}>
            Main Star:{" "}
          </label>
          <MainStarInput value={input.mainStar} setValue={setInput} />
        </div>
        <div className={classes.group}>
          <label htmlFor="description" className={classes.label}>
            Description:{" "}
          </label>
          <Input
            id="description"
            multiline
            className={classes.description}
            errors={fieldErrors(error, "description")}
            value={input.description ?? ""}
            onChange={(value) => setInput({ ...input, description: value })}
          />
        </div>
        <div className={classes.group}>
          <label htmlFor="releaseDate" className={classes.label}>
            Released On:{" "}
          </label>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateField
              id="releaseDate"
              value={input.releaseDate}
              InputProps={{ className: classes.dateField }}
              onChange={(value) => setInput({ ...input, releaseDate: value })}
            />
          </LocalizationProvider>
        </div>
        <div className={classes.group}>
          <label htmlFor="poster" className={classes.label}>
            Poster Link:{" "}
          </label>
          <Input
            type="text"
            id="poster"
            errors={fieldErrors(error, "poster")}
            value={input.poster ?? ""}
            onChange={(value) => setInput({ ...input, poster: value })}
          />
        </div>
        {!!error && !(error instanceof HttpError) && (
          <span className={classes.errorMessage}>Something went wrong</span>
        )}
        <div className={classes.actions}>
          <Button
            type="button"
            variant="accent"
            disabled={loading}
            onClick={exitEditMode}
          >
            Cancel
          </Button>
          <Button variant="accent" disabled={loading} onClick={editMovie}>
            {loading ? <>Loading...</> : <>Edit movie</>}
          </Button>
        </div>
      </form>
    </FormLayout>
  );
}
