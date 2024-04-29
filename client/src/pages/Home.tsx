import { Link } from "react-router-dom";
import { Button } from "../components/Button";
import classes from "./Home.module.css";
import { useCurrentUser } from "../contexts/CurrentUserContext";
import { UserRole } from "../services/userInfoStorage";

export function Home() {
  const user = useCurrentUser();
  const userIsAdmin = user?.tokenInfo.role === UserRole.Admin;

  return (
    <div className={classes.root}>
      <h1>Welcome to Movies Hub!</h1>
      <p>
        Here we discuss the various aspects of the cinema world! Feel free to
        rate and write reviews and comments!
      </p>
      <Link to={"movies"}>
        <Button variant="primary">View movies</Button>
      </Link>
      {userIsAdmin ? (
        <Link to={"add-movie"}>
          <Button variant="primary">Add a new movie</Button>
        </Link>
      ) : null}
    </div>
  );
}
