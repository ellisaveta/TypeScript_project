import classes from "./RadioGroup.module.css";

export interface RadioOption {
  label: string;
  value: string;
}

interface RadioGroupProps {
  options: RadioOption[];
  onChange: (value: string) => unknown;
  value: string;
}

export function RadioGroup({ options, onChange, value }: RadioGroupProps) {
  return (
    <div className={classes.group}>
      {options.map((option) => (
        <label key={option.value} className={classes.theme}>
          {option.label}
          <input
            type="radio"
            value={option.value}
            onChange={(e) => onChange(e.target.value)}
            checked={value === option.value}
          />
        </label>
      ))}
    </div>
  );
}
