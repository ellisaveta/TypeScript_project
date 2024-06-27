import { useNavigate, useParams } from "react-router";
import { useCurrentUser } from "../contexts/CurrentUserContext";
import { UserRole } from "../services/userInfoStorage";
import { useCallback, useState } from "react";
import { useAsync } from "../hooks/useAsync";
import classes from "../pages/ActorDetails.module.css";
import { actorsService } from "../services/actors";
import { useAsyncAction } from "../hooks/useAsyncAction";
import { HttpError } from "../services/http";
import { BackButton } from "../components/BackButton";
import { IconButton } from "@mui/material";
import { DeleteForever, Edit } from "@mui/icons-material";
import { EditActor } from "../components/EditActor";

export function ActorDetails() {
  const user = useCurrentUser();
  const userIsAdmin = user?.tokenInfo.role === UserRole.Admin;

  const { id } = useParams();

  const navigate = useNavigate();

  const [inEditMode, setInEditMode] = useState(false);

  const {
    data: actor,
    loading,
    error,
    reload,
  } = useAsync(() => {
    if (!id) {
      throw new Error("Actor id is missing!");
    }

    return actorsService.getById(Number(id));
  }, [id]);

  const onEdit = useCallback(() => {
    setInEditMode(true);
  }, []);

  const exitEditMode = useCallback(() => {
    setInEditMode(false);
    reload();
  }, []);

  const { error: deleteActorError, trigger: deleteActor } = useAsyncAction(
    async () => {
      if (!id) {
        throw new Error("Actor id is missing!");
      }

      const movie = await actorsService.deleteActor(id);

      navigate(`/movies`);
      return movie;
    }
  );

  if (loading && !actor) {
    return <h1>Loading...</h1>;
  }

  if (!actor && !loading && error instanceof HttpError) {
    return <h1>No actor found with id: {id}!</h1>;
  }

  if (error || deleteActorError) {
    return <span className={classes.errorLabel}>Something went wrong!</span>;
  }

  return actor && inEditMode ? (
    <EditActor actor={actor} exitEditMode={exitEditMode} />
  ) : actor ? (
    <div>
      <BackButton goBack={() => navigate(-1)} />
      <div className={classes.actor}>
        <img
          src={actor.picture}
          alt="Actor picture"
          className={classes.picture}
        />
        <div className={classes.actorInfo}>
          <div className={classes.editDelete}>
            <p className={classes.name}>{actor.name}</p>
            {userIsAdmin ? (
              <>
                <IconButton onClick={onEdit}>
                  <Edit />
                </IconButton>
                <IconButton onClick={deleteActor}>
                  <DeleteForever color="error" />
                </IconButton>
              </>
            ) : null}
          </div>
          <div className={classes.details}>
            <p>Gender: {actor.gender}</p>
            {actor.bio ? <p>Bio: {actor.bio}</p> : null}
          </div>
        </div>
      </div>
    </div>
  ) : null;
}
