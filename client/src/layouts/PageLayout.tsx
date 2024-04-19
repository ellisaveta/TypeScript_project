import { Header } from "../components/Header";
import classes from "./PageLayout.module.css";

interface PageLayoutProps {
    element: React.ReactNode;
}

export function PageLayout({ element }: PageLayoutProps): React.ReactElement {
    return <>
        <Header />
        <div className={classes.body}>{element}</div>
    </>;
}