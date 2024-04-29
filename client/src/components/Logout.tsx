import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useUserPreferences } from "../contexts/UserPreferencesContext";
import { authService } from "../services/auth";
import { Button } from "./Button";

export function Logout() {
  const navigate = useNavigate();
  const { clearPreferences } = useUserPreferences();

  const onClick = useCallback(() => {
    authService.logout();
    clearPreferences();
    navigate("/");
  }, []);
  return (
    <Button variant="accent" onClick={onClick}>
      Logout
    </Button>
  );
}
