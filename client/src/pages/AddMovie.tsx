import { FormEvent, useState } from "react";
import { useAsyncAction } from "../hooks/useAsyncAction";
import { InputMovieModel, moviesService } from "../services/movies";
import { Navigate, useNavigate } from "react-router-dom";
import { FormLayout } from "../layouts/FormLayout";
import classes from "./AddMovie.module.css";
import { Input } from "../components/Input";
import { fieldErrors } from "../lib/fieldError";
import { HttpError } from "../services/http";
import { Button } from "../components/Button";
import { DateField, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useCurrentUser } from "../contexts/CurrentUserContext";
import { UserRole } from "../services/userInfoStorage";
import { MainStarInput } from "../components/MainStarInput";

export function AddMovie() {
  const [input, setInput] = useState<InputMovieModel>({
    title: undefined,
    director: undefined,
    mainStar: null,
    description: undefined,
    releaseDate: null,
    poster: undefined,
  });

  const user = useCurrentUser();

  if (!user || user.tokenInfo.role !== UserRole.Admin) {
    return <Navigate to="/" />;
  }

  const navigate = useNavigate();

  const { loading, error, trigger } = useAsyncAction(
    async (event: FormEvent) => {
      event.preventDefault();

      const movie = await moviesService.addMovie({
        ...input,
        title: input.title !== "" ? input.title : undefined,
        director: input.director !== "" ? input.director : undefined,
        description: input.description !== "" ? input.description : undefined,
        poster: input.poster !== "" ? input.poster : undefined,
      });

      setInput({
        title: undefined,
        director: undefined,
        mainStar: null,
        description: undefined,
        releaseDate: null,
        poster: undefined,
      });

      navigate(`/movies`);

      return movie;
    }
  );

  return (
    <FormLayout>
      <h1>Add a new movie</h1>
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
              sx={{
                "& .MuiOutlinedInput-root": { color: "var(--main-text-color)" },
              }}
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
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
          <Button variant="accent" disabled={loading} onClick={trigger}>
            {loading ? <>Loading...</> : <>Add movie</>}
          </Button>
        </div>
      </form>
    </FormLayout>
  );
}
