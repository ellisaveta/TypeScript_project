import { Navigate, Outlet, useLocation } from "react-router";
import { useCurrentUser } from "../contexts/CurrentUserContext";

export function PublicOutlet() {
    const user = useCurrentUser();
    const { search } = useLocation();
    return user ? <Navigate to={`/${search}`} /> : <Outlet />;
}