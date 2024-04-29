import classes from "./Input.module.css";
import cls from "classnames";
import { HTMLInputTypeAttribute } from "react";

interface BaseInputProps {
  placeholder?: string;
  id?: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  errors?: string[];
}

type InputProps = BaseInputProps &
  ({ multiline?: false; type?: HTMLInputTypeAttribute } | { multiline: true });

export function Input({
  className,
  id,
  placeholder,
  value,
  onChange,
  errors,
  ...props
}: InputProps) {
  if (props.multiline) {
    return (
      <div className={classes.root}>
        <textarea
          className={cls(classes.input, className)}
          placeholder={placeholder}
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        {errors?.map((error) => (
          <span key={error} className={classes.errorLabel}>
            {error}
          </span>
        ))}
      </div>
    );
  }
  return (
    <div className={classes.root}>
      <input
        className={cls(classes.input, className)}
        placeholder={placeholder}
        type={props.type}
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {errors?.map((error) => (
        <span key={error} className={classes.errorLabel}>
          {error}
        </span>
      ))}
    </div>
  );
}
