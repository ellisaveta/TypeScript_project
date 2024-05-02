import { useCallback } from "react";
import { GridMoviesView } from "../components/GridMoviesView";
import { useAsync } from "../hooks/useAsync";
import { ListMoviesView } from "../components/ListMoviesView";
import classes from "./MoviesLibrary.module.css";
import { MovieModel, moviesService } from "../services/movies";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { BackButton } from "../components/BackButton";

export interface MoviesLibraryProps {
  movies: MovieModel[];
}

export function MoviesLibrary() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get("query") ?? "";
  const pageQuery = searchParams.get("page") ?? "1";
  const PAGE_SIZE = 6;

  const { data, loading, error } = useAsync(
    () => moviesService.getAllMovies(Number(pageQuery), PAGE_SIZE, query),
    [pageQuery, query]
  );

  const isGrid = searchParams.get("view") === "grid";

  const onViewChange = useCallback(() => {
    searchParams.set("view", isGrid ? "list" : "grid");

    setSearchParams(searchParams);
  }, [searchParams, setSearchParams]);

  const onSearchInputChange = useCallback(
    (e: string) => {
      searchParams.set("page", "1");
      searchParams.set("query", e);
      setSearchParams(searchParams);
    },
    [searchParams, setSearchParams]
  );

  let page = Number(searchParams.get("page") ?? 1);

  const onNextPageRequest = useCallback(() => {
    if (data?.total) {
      const pagesNum = data.total / PAGE_SIZE;
      if (
        page > pagesNum ||
        (page === pagesNum && data.total % PAGE_SIZE === 0)
      ) {
        return;
      }
    }
    page++;
    searchParams.set("page", page.toString());
    setSearchParams(searchParams);
  }, [searchParams, setSearchParams, data]);

  const onPreviousPageRequest = useCallback(() => {
    if (page <= 1) {
      return;
    }
    page--;
    searchParams.set("page", page.toString());
    setSearchParams(searchParams);
  }, [searchParams, setSearchParams]);

  return (
    <>
      <BackButton goBack={() => navigate(-1)} />

      <div className={classes.flex}>
        <h1 className={classes.header}>All movies:</h1>
        <Input
          className={classes.search}
          type="search"
          value={query}
          onChange={(e) => {
            onSearchInputChange(e);
          }}
          placeholder="Search"
        />
        <Button
          variant="secondary"
          className={classes.viewButton}
          onClick={onViewChange}
        >
          Change view
        </Button>
      </div>
      <div>
        {loading && <>Loading...</>}
        {!!error && (
          <span className={classes.errorLabel}>Something went wrong</span>
        )}
        {data?.movies && (
          <>
            {isGrid ? (
              <GridMoviesView movies={data.movies} />
            ) : (
              <ListMoviesView movies={data.movies} />
            )}
            {data.total > 6 ? (
              <div className={classes.pagination}>
                <Button
                  className={classes.paginationButton}
                  onClick={onPreviousPageRequest}
                >
                  &#8882;
                </Button>
                <p>{pageQuery}</p>
                <Button
                  className={classes.paginationButton}
                  onClick={onNextPageRequest}
                >
                  &#8883;
                </Button>
              </div>
            ) : data.total === 0 ? (
              <h3>No movies to show!</h3>
            ) : null}
          </>
        )}
      </div>
    </>
  );
}
