import { FormEvent, useState } from "react";
import { useAsyncAction } from "../hooks/useAsyncAction";
import { fieldErrors } from "../lib/FieldError";
import { InputError } from "../services/http";
import { moviesService } from "../services/movies";
import { Button } from "./Button";
import { Input } from "./Input";
import classes from "./AddComment.module.css";

interface AddCommentProps {
    movieId: string;
    onComment: () => void;
}

export function AddComment({ movieId, onComment }: AddCommentProps) {
    const [content, setContent] = useState('');

    const { trigger: addComment, loading, error } = useAsyncAction(async (event: FormEvent) => {
        event.preventDefault();
        await moviesService.addComment(Number(movieId), content);
        setContent('');
        onComment();
    });

    return (
        <form onSubmit={addComment} className={classes.form}>
            <Input placeholder="Write a comment..."
                multiline
                errors={fieldErrors(error, 'content')}
                value={content}
                onChange={(value) => setContent(value)}
                className={classes.input}
            />
            {!!error && !(error instanceof InputError) && <span className={classes.errorLabel}>Something went wrong</span>}
            <Button type='submit' className={classes.post} disabled={loading}>{loading ? <>Loading...</> : <>Post</>}</Button>
        </form>
    );
}