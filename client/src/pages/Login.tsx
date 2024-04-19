import { FormEvent, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { Button } from "../components/Button";
import { FormLayout } from "../layouts/FormLayout";
import { Input } from "../components/Input";
import { useAsyncAction } from "../hooks/useAsyncAction";
import { authService, InvalidCredentialsError } from "../sevices/auth";

import classes from "./Login.module.css";

export function Login() {
    const [email, setEmail] = useState('');

    const [password, setPassword] = useState('');
    const location = useLocation();
    const navigate = useNavigate();

    const { data, loading, error, trigger, perform } = useAsyncAction(async (event?: FormEvent) => {
        event?.preventDefault();

        const locationFrom = location.state?.locationFrom;
        const user = await authService.login(email, password);
        setEmail('');
        setPassword('');

        navigate(locationFrom ?? `/`);
        return user;
    });

    return (
        <FormLayout>
            <h1 className={classes.title}>Login</h1>
            <form className={classes.form} onSubmit={trigger}>
                <div className={classes.group}>
                    <label htmlFor="email" className={classes.label}>Email: </label>
                    <Input type="email" id="email"
                        value={email} onChange={setEmail} />
                </div>
                <div className={classes.group}>
                    <label htmlFor="password" className={classes.label}>Password: </label>
                    <Input type="password" id="password"
                        value={password} onChange={setPassword} />
                </div>

                {!!error && <span className={classes.errorMessage}>{messageForError(error)}</span>}
                <Button variant='accent' disabled={loading} type="submit" className={classes.login}>
                    {loading ? <>Loading...</> : <>Login</>}</Button>
            </form>
            <div className={classes.signUpRedirect}>
                <p>Don`t have an account?</p>
                <Link to='/registration'>Sign up</Link>
            </div>
        </FormLayout>
    );
}

function messageForError(error: unknown) {
    if (error instanceof InvalidCredentialsError) {
        return 'Invalid email or password'
    }

    console.log(error);
    return 'Something went wrong'
}
