import cls from 'classnames';
import classes from './Checkbox.module.css';

interface CheckboxProps
    extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> { }

export function Checkbox({ className, ...checkboxProps }: CheckboxProps) {
    return <input type='checkbox' className={cls(classes.checkbox, className)} {...checkboxProps} />
}