import cls from 'classnames';
import classes from './Button.module.css';

interface ButtonProps
    extends React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'accent';
}

export function Button({ variant = 'secondary', children, className, ...buttonProps }: ButtonProps) {
    return <button className={cls(classes.button, classes[variant], className)} {...buttonProps}>{children}</button>
}