import { MovieModel } from "../sevices/movies";
import { Comment } from "../components/Comment";
import classes from "./CommentsSection.module.css";

interface CommentsSectionProps {
    movie: MovieModel;
}

export function CommentsSection({ movie }: CommentsSectionProps) {
    return (
        <div>
            <h3 className={classes.sectionName}>Comments:</h3>
            {movie.comments ? movie.comments.map(comment => <Comment key={comment.id} comment={comment} />) : null}
        </div>);
}