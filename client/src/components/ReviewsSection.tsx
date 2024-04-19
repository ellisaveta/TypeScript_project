import { MovieModel } from "../services/movies";
import { Review } from "./Review";
import classes from "./ReviewsSection.module.css";

interface ReviewsSectionProps {
    movie: MovieModel;
}

export function ReviewsSection({ movie }: ReviewsSectionProps) {
    return (
        <div>
            <h1 className={classes.sectionName}>Reviews:</h1>
            {movie.reviews ? movie.reviews.map(review => <Review key={review.id} review={review} />) : null}
        </div>
    );
}