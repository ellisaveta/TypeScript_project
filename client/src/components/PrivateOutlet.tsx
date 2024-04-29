import { Navigate, Outlet, useLocation } from "react-router";
import { useCurrentUser } from "../contexts/CurrentUserContext";

export function NavigateToLogin() {
  const location = useLocation();
  return <Navigate to="/login" state={{ locationFrom: location.pathname }} />;
}

export function PrivateOutlet() {
  const user = useCurrentUser();
  return user ? <Outlet /> : <NavigateToLogin />;
}
