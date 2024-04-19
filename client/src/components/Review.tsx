import { ReviewModel } from "../sevices/movies";
import classes from "./Review.module.css";

interface ReviewProps {
    review: ReviewModel;
}

export function Review({ review }: ReviewProps) {
    return (
        <div className={classes.root}>
            <div className={classes.header}>
                <div className={classes.author}>
                    <img src="/user.svg" alt="Account image"
                        className={classes.image} />
                    <p className={classes.name}>{review.user.name}</p>
                </div>
                <p className={classes.rate}>Rating: {review.rating}</p>
            </div>
            <p className={classes.content}>{review.content}</p>
        </div>
    );
}