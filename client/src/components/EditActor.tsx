import { FormEvent, useState } from "react";
import { ActorModel, InputActorModel, actorsService } from "../services/actors";
import { useAsyncAction } from "../hooks/useAsyncAction";
import { FormLayout } from "../layouts/FormLayout";
import classes from "./EditActor.module.css";
import { Button } from "./Button";
import { HttpError } from "../services/http";
import { Input } from "./Input";
import { fieldErrors } from "../lib/fieldError";
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";

interface Props {
  actor: ActorModel;
  exitEditMode: () => void;
}

export function EditActor({ actor, exitEditMode }: Props) {
  const [input, setInput] = useState<InputActorModel>(actor);

  const {
    loading,
    error,
    trigger: editActor,
  } = useAsyncAction(async (event: FormEvent) => {
    event.preventDefault();

    const editedActor = await actorsService.editActor(actor.id, {
      ...input,
      bio: input.bio !== "" ? input.bio : undefined,
      picture: input.picture !== "" ? input.picture : undefined,
    });

    exitEditMode();

    return editedActor;
  });

  return (
    <FormLayout>
      <h1>Edit movie</h1>
      <form className={classes.form}>
        <div className={classes.group}>
          <label htmlFor="name" className={classes.label}>
            Name:{" "}
          </label>
          <Input
            type="text"
            id="name"
            errors={fieldErrors(error, "name")}
            value={input.name ?? ""}
            onChange={(value) => setInput({ ...input, name: value })}
          />
        </div>
        <FormControl>
          <FormLabel sx={{ color: "var(--main-text-color)" }}>
            Gender:{" "}
          </FormLabel>
          <RadioGroup
            value={input.gender ?? "male"}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setInput({
                ...input,
                gender: event.target.value,
              })
            }
          >
            <FormControlLabel
              value="male"
              control={<Radio sx={{ color: "var(--main-text-color)" }} />}
              label="Male"
            />
            <FormControlLabel
              value="female"
              control={<Radio sx={{ color: "var(--main-text-color)" }} />}
              label="Female"
            />
          </RadioGroup>
        </FormControl>
        <div className={classes.group}>
          <label htmlFor="bio" className={classes.label}>
            Bio:{" "}
          </label>
          <Input
            id="bio"
            multiline
            className={classes.bio}
            errors={fieldErrors(error, "bio")}
            value={input.bio ?? ""}
            onChange={(value) => setInput({ ...input, bio: value })}
          />
        </div>
        <div className={classes.group}>
          <label htmlFor="picture" className={classes.label}>
            Picture:{" "}
          </label>
          <Input
            type="text"
            id="picture"
            errors={fieldErrors(error, "picture")}
            value={input.picture ?? ""}
            onChange={(value) => setInput({ ...input, picture: value })}
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
          <Button variant="accent" disabled={loading} onClick={editActor}>
            {loading ? <>Loading...</> : <>Edit actor</>}
          </Button>
        </div>
      </form>
    </FormLayout>
  );
}
