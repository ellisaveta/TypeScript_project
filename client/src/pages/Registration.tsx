import { FormEvent, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { FormLayout } from "../layouts/FormLayout";
import { Input } from "../components/Input";
import { useAsyncAction } from "../hooks/useAsyncAction";
import { authService } from "../services/auth";
import { EmailAlreadyExists, HttpError, InputError } from "../services/http";
import classes from "./Registration.module.css";
import { fieldErrors } from "../lib/fieldError";

export function Registration() {
  const [input, setInput] = useState({
    name: "",
    email: "",
    password: "",
  });

  const location = useLocation();
  const navigate = useNavigate();

  const { loading, error, trigger } = useAsyncAction(
    async (event: FormEvent) => {
      event.preventDefault();

      const locationFrom = location.state?.locationFrom;
      const user = await authService.register(input);

      setInput({ name: "", email: "", password: "" });
      navigate(locationFrom ?? `/`);
      return user;
    }
  );

  return (
    <FormLayout>
      <h1>Registration</h1>
      <form className={classes.form} onSubmit={trigger}>
        <div className={classes.group}>
          <label htmlFor="name" className={classes.label}>
            Name:{" "}
          </label>
          <Input
            type="text"
            id="name"
            errors={fieldErrors(error, "name")}
            value={input.name}
            onChange={(value) => setInput({ ...input, name: value })}
          />
        </div>
        <div className={classes.group}>
          <label htmlFor="email" className={classes.label}>
            Email:{" "}
          </label>
          <Input
            type="email"
            id="email"
            errors={fieldErrors(error, "email")}
            value={input.email}
            onChange={(value) => setInput({ ...input, email: value })}
          />
        </div>
        <div className={classes.group}>
          <label htmlFor="password" className={classes.label}>
            Password:{" "}
          </label>
          <Input
            type="password"
            id="password"
            errors={fieldErrors(error, "password")}
            value={input.password}
            onChange={(value) => setInput({ ...input, password: value })}
          />
        </div>
        {!!error && error instanceof EmailAlreadyExists && (
          <span className={classes.errorMessage}>{error.message}</span>
        )}
        {!!error && !(error instanceof HttpError) && (
          <span className={classes.errorMessage}>Something went wrong</span>
        )}
        <Button
          variant="accent"
          disabled={loading}
          type="submit"
          className={classes.register}
        >
          {loading ? <>Loading...</> : <>Sign up</>}
        </Button>
      </form>
      <div className={classes.loginRedirect}>
        <p>Already have an account?</p>
        <Link to="/login">Login</Link>
      </div>
    </FormLayout>
  );
}
