import {
  Autocomplete,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
  createFilterOptions,
} from "@mui/material";
import { InputMovieModel, MainStarType } from "../services/movies";
import { Fragment, useCallback, useState } from "react";
import { useAsync } from "../hooks/useAsync";
import { InputActorModel, actorsService } from "../services/actors";
import { useAsyncAction } from "../hooks/useAsyncAction";

const filter = createFilterOptions<MainStarType>();

interface Props {
  value: MainStarType | null;
  setValue: React.Dispatch<React.SetStateAction<InputMovieModel>>;
}

export function MainStarInput({ value, setValue }: Props) {
  const [open, toggleOpen] = useState(false);

  const {
    data: actors,
    loading: loadingActors,
    error: gettingActorsError,
    reload,
  } = useAsync(async () => {
    const allActors = await actorsService.getActors();
    return allActors.map(({ id, name }) => ({
      id,
      name,
      inputValue: undefined,
    }));
  }, []);

  const [dialogValue, setDialogValue] = useState<InputActorModel>({
    name: "",
    gender: "male",
    bio: undefined,
    picture: undefined,
  });

  const handleClose = useCallback(() => {
    setDialogValue({
      name: "",
      gender: "male",
      bio: undefined,
      picture: undefined,
    });
    toggleOpen(false);
    reload();
  }, []);

  const { perform: handleSubmit } = useAsyncAction(
    async (event: React.FormEvent<HTMLFormElement>) => {
      const newActor = await actorsService.addActor(dialogValue);

      setValue((current) => ({
        ...current,
        mainStar: {
          name: newActor.name,
          id: newActor.id,
        },
      }));
      handleClose();
    }
  );

  return (
    <Fragment>
      <Autocomplete
        value={value}
        onChange={(event, newValue) => {
          if (typeof newValue === "string") {
            // timeout to avoid instant validation of the dialog's form.
            setTimeout(() => {
              toggleOpen(true);
              setDialogValue({
                name: newValue,
                gender: "male",
                bio: undefined,
                picture: undefined,
              });
            });
          } else if (newValue && newValue.inputValue) {
            toggleOpen(true);
            setDialogValue({
              name: newValue.inputValue,
              gender: "male",
              bio: undefined,
              picture: undefined,
            });
          } else {
            setValue((current) => ({
              ...current,
              mainStar: newValue,
            }));
          }
        }}
        filterOptions={(options, params) => {
          const filtered = filter(options, params);

          if (params.inputValue !== "") {
            filtered.push({
              inputValue: params.inputValue,
              name: `Add "${params.inputValue}"`,
              id: 0,
            });
          }

          return filtered;
        }}
        options={actors ?? []}
        getOptionLabel={(option) => {
          // e.g. value selected with enter, right from the input
          if (typeof option === "string") {
            return option;
          }
          if (option.inputValue) {
            return option.inputValue;
          }
          return option.name;
        }}
        selectOnFocus
        clearOnBlur
        handleHomeEndKeys
        renderOption={(props, option) => <li {...props}>{option.name}</li>}
        sx={{ width: 300 }}
        freeSolo
        renderInput={(params) => <TextField {...params} required />}
      />
      <Dialog open={open} onClose={handleClose}>
        <form onSubmit={handleSubmit}>
          <DialogTitle>Add a new actor</DialogTitle>
          <DialogContent sx={{ display: "flex", flexDirection: "column" }}>
            <DialogContentText>
              You didn`t find the actor you are searching for? Please, add it!
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="actor"
              value={dialogValue.name}
              onChange={(event) =>
                setDialogValue({
                  ...dialogValue,
                  name: event.target.value,
                })
              }
              label="Name"
              type="text"
              variant="standard"
            />
            <FormControl>
              <FormLabel>Gender</FormLabel>
              <RadioGroup
                value={dialogValue.gender ?? "male"}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  setDialogValue({
                    ...dialogValue,
                    gender: event.target.value,
                  })
                }
              >
                <FormControlLabel
                  value="male"
                  control={<Radio />}
                  label="Male"
                />
                <FormControlLabel
                  value="female"
                  control={<Radio />}
                  label="Female"
                />
              </RadioGroup>
            </FormControl>
            <TextField
              autoFocus
              margin="dense"
              id="bio"
              value={dialogValue.bio}
              onChange={(event) =>
                setDialogValue({
                  ...dialogValue,
                  bio: event.target.value,
                })
              }
              multiline
              label="Bio"
              type="text"
              variant="standard"
            />
            <TextField
              margin="dense"
              id="picture"
              value={dialogValue.picture}
              onChange={(event) =>
                setDialogValue({
                  ...dialogValue,
                  picture: event.target.value,
                })
              }
              multiline
              label="Picture URL"
              type="text"
              variant="standard"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit">Add</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Fragment>
  );
}
