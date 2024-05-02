import { useUserPreferences } from "../contexts/UserPreferencesContext";
import { RadioGroup, RadioOption } from "./RadioGroup";

type Theme = "light" | "dark";

const OPTIONS: RadioOption[] = [
  {
    label: "Light",
    value: "light",
  },
  {
    label: "Dark",
    value: "dark",
  },
];

export function ThemeSelector() {
  const {
    preferences: { theme },
    setPreferences,
  } = useUserPreferences();

  return (
    <div>
      <RadioGroup
        options={OPTIONS}
        onChange={(value) => setPreferences({ theme: value as Theme })}
        value={theme}
      />
    </div>
  );
}
