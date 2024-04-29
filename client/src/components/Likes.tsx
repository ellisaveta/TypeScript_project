import classes from "./Likes.module.css";

interface LikesProps {
  count: number;
}

export function Likes({ count }: LikesProps) {
  return <p className={classes.likes}>Likes: {count}</p>;
}
