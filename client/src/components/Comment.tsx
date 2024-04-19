import { CommentModel } from "../sevices/movies";
import classes from "./Comment.module.css";

interface CommentProps {
    comment: CommentModel;
}

export function Comment({ comment }: CommentProps) {
    return (
        <div className={classes.root}>
            <div className={classes.author}>
                <img src="/user.svg" alt="Account image"
                    className={classes.image} />
                <p className={classes.name}>{comment.user.name}</p>
            </div>
            <p className={classes.content}>{comment.content}</p>
        </div>
    );
}