import { useState } from "react";
import { Link } from "react-router-dom";
import { MovieModel } from "../services/movies";
import { Button } from "./Button";
import classes from "./MovieListItem.module.css";

interface MovieListItemProps {
    movie: MovieModel;
}

export function MovieListItem({ movie }: MovieListItemProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const releaseDate = movie.releaseDate ? new Date(movie.releaseDate) : undefined;

    return (
        <div className={classes.movie}>
            <div className={classes.header}>
                <Link to={`/movies/${movie.id}`} className={classes.movieHeader}>
                    <img src={movie.poster} alt="Movie poster" className={classes.poster} />
                    <p className={classes.title}>{movie.title}</p>
                </Link>
                <Button variant='secondary' className={isExpanded ? classes.expandButtonActive : classes.expandButton}
                    onClick={() => setIsExpanded(!isExpanded)}>&#8675;</Button>
            </div>
            {isExpanded ? <div className={classes.details}>
                {movie.director ? <p>Director: {movie.director}</p> : null}
                {movie.mainStar ? <p>Main star: {movie.mainStar}</p> : null}
                {releaseDate ? <p>Release date: {releaseDate.toDateString()}</p> : null}

            </div> : null}
        </div>
    );
}