import { ReactNode } from "react";
import classes from "./FormLayout.module.css";
import cls from "classnames";

export interface FormProps {
    children: ReactNode;
    className?: string;
}

export function FormLayout({ children, className }: FormProps) {
    return (
        <div className={cls(classes.root, className)}>
            {children}
        </div>
    );
}