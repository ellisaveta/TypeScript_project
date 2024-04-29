import { Link } from "react-router-dom";
import { useCurrentUser } from "../contexts/CurrentUserContext";
import classes from "./Header.module.css";
import { Logout } from "./Logout";
import { ThemeSelector } from "./ThemeSelector";

export function Header() {
  const user = useCurrentUser();
  return (
    <div className={classes.header}>
      <Link to={"/"} className={classes.logo}>
        MoviesHub
      </Link>
      {user ? (
        <div className={classes.userSection}>
          <h1 className={classes.user}>{user.name}</h1>
          <div className={classes.themeSelection}>
            <ThemeSelector />
          </div>
          <Logout />
        </div>
      ) : null}
    </div>
  );
}
