import { MovieModel } from "../../src/models/movie-model";
import { MovieService } from "../../src/services/movie-service";
import { createComment, createLike, createMovie, createReview, createUser } from "../support/factories";

describe('MovieService', () => {
    describe('#add', () => {
        it('adds movie', async () => {
            const movieService = new MovieService();

            const added = await movieService.add({
                title: 'Titanic',
                director: 'James Cameron',
                mainStar: 'Leonardo DiCaprio',
                releaseDate: new Date('1997-11-01'),
                poster: 'https://www.shutterstock.com/image-vector/picture-vector-icon-no-image-260nw-1350441335.jpg'
            });

            const movie = await MovieModel.query()
                .findOne({ title: 'Titanic', director: 'James Cameron' });

            expect(movie!.mainStar).toEqual('Leonardo DiCaprio');
            expect(movie!.id).toEqual(added.id);
        });
    });

    describe('#deleteById', () => {
        it('deletes correct movie', async () => {
            const movieService = new MovieService();
            const addedMovie = await createMovie({ title: 'Titanic' });

            await movieService.deleteById(addedMovie.id);
            const movie = await MovieModel.query().findOne({ title: 'Titanic' });
            expect(movie).toBeUndefined();
        });

        it('does not delete other movies', async () => {
            const movieService = new MovieService();
            const addedMovie1 = await createMovie({ title: 'Titanic' });
            await createMovie({ title: 'Titanic' });

            await movieService.deleteById(addedMovie1.id);
            const movie = await MovieModel.query().findOne({ title: 'Titanic' });
            expect(movie!.director).toEqual('James Cameron');
        });
    });

    describe('#listAllMovies', () => {
        it('lists all movies ordered by title', async () => {
            const movieService = new MovieService();
            await createMovie({ title: 'Titanic' });
            await createMovie({ title: 'Gattaca' });

            const movies = await movieService.listAllMovies(1, 2);

            expect(movies!.total).toEqual(2);
            expect(movies!.results[0].title).toEqual('Gattaca');
            expect(movies!.results[1].title).toEqual('Titanic');
        });

        it('lists only the exact number of movies ordered by title on the exact page', async () => {
            const movieService = new MovieService();
            await createMovie({ title: 'Titanic' });
            await createMovie({ title: 'Gattaca' });

            const movies = await movieService.listAllMovies(2, 1);

            expect(movies!.total).toEqual(2);
            expect(movies!.results[0].title).toEqual('Titanic');
        });

        it('lists nothing if the page and size are too big', async () => {
            const movieService = new MovieService();
            await createMovie({ title: 'Titanic' });
            await createMovie({ title: 'Gattaca' });

            const movies = await movieService.listAllMovies(2, 3);

            expect(movies!.total).toEqual(2);
            expect(movies!.results).toEqual([]);
        });
    });

    describe('#moviesOrderedByAverageRating', () => {
        it('lists all movies ordered by rating descending', async () => {
            const movieService = new MovieService();
            const movie1 = await createMovie({ title: 'Titanic' });
            const movie2 = await createMovie({ title: 'Gattaca' });
            await createMovie({ title: 'Molan' });
            await createMovie({ title: 'Albinos' });

            const user = await createUser();
            await createReview({ user: user, movieId: movie1.id, rating: 2 });
            await createReview({ user: user, movieId: movie2.id, rating: 4 });

            const movies = await movieService.moviesOrderedByAverageRating(1, 5);

            expect(movies!.total).toEqual(4);
            expect(movies!.results[0].title).toEqual('Gattaca');
            expect(movies!.results[1].title).toEqual('Titanic');
            expect(movies!.results[2].title).toEqual('Albinos');
            expect(movies!.results[3].title).toEqual('Molan');
        });

        it('lists only the exact number of movies ordered by title on the exact page', async () => {
            const movieService = new MovieService();
            const movie1 = await createMovie({ title: 'Titanic' });
            await createMovie({ title: 'Gattaca' });
            const user = await createUser();
            await createReview({ user: user, movieId: movie1.id, rating: 2 });


            const movies = await movieService.moviesOrderedByAverageRating(2, 1);

            expect(movies!.total).toEqual(2);
            expect(movies!.results[0].title).toEqual('Gattaca');
        });

        it('lists nothing if the page and size are too big', async () => {
            const movieService = new MovieService();
            await createMovie({ title: 'Titanic' });
            await createMovie({ title: 'Gattaca' });

            const movies = await movieService.moviesOrderedByAverageRating(2, 3);

            expect(movies!.total).toEqual(2);
            expect(movies!.results).toEqual([]);
        });
    });

    describe('#getMovieById', () => {
        it('gets movie with valid id', async () => {
            const movieService = new MovieService();
            const added = await createMovie({ title: 'Titanic' });

            const movie = await movieService.getMovieById(added.id);

            expect(movie!.title).toEqual('Titanic');
        });

        it('does not find user with invalid id', async () => {
            const movieService = new MovieService();
            const added = await createMovie({ title: 'Titanic' });

            const movie = await movieService.getMovieById(added.id + 1);

            expect(movie).toBeUndefined();
        });
    });

    describe('#getMovieWithLikes', () => {
        it('gets movie with like with valid id', async () => {
            const movieService = new MovieService();
            const addedMovie = await createMovie();
            const addedUser = await createUser({ name: 'Philip Tomov' });
            await createLike({ userId: addedUser.id, movieId: addedMovie.id });
            const movie = await movieService.getMovieWithLikes(addedMovie.id);

            expect(movie!.likedBy![0].name).toEqual('Philip Tomov');
        });
    });

    describe('#getMovieWithComment', () => {
        it('gets movie with comment with valid id', async () => {
            const movieService = new MovieService();
            const addedMovie = await createMovie();
            const addedUser = await createUser();
            await createComment({ user: addedUser, movieId: addedMovie.id, content: 'Super!' });
            const movie = await movieService.getMovieWithComments(addedMovie.id);

            expect(movie!.comments![0]!.content).toEqual('Super!');
        });
    });

    describe('#getMovieWithReview', () => {
        it('gets movie with review with valid id', async () => {
            const movieService = new MovieService();
            const addedMovie = await createMovie();
            const addedUser = await createUser();
            await createReview({ user: addedUser, movieId: addedMovie.id, rating: 4 });
            const movie = await movieService.getMovieWithReviews(addedMovie.id);

            expect(movie!.reviews![0].rating).toEqual(4);
        });
    });

    describe('#getMovieWithInfo', () => {
        it('gets movie with info with valid id', async () => {
            const movieService = new MovieService();
            const addedMovie = await createMovie();
            const addedUser = await createUser({ name: 'Philip Tomov' });
            await createLike({ userId: addedUser.id, movieId: addedMovie.id });
            await createComment({ user: addedUser, movieId: addedMovie.id, content: 'Super!' });
            await createReview({ user: addedUser, movieId: addedMovie.id, rating: 4 });
            const movie = await movieService.getMovieWithInfo(addedMovie.id);

            expect(movie!.likedBy![0].name).toEqual('Philip Tomov');
            expect(movie!.comments![0]!.content).toEqual('Super!');
            expect(movie!.reviews![0].rating).toEqual(4);
        });
    });

    describe('#searchMoviesByDirector', () => {
        it('finds movie with existing director', async () => {
            const movieService = new MovieService();
            await createMovie({ title: 'Titanic', director: 'James Cameron' });

            const movie = await movieService.searchMoviesByDirector('James Cameron');

            expect(movie![0].title).toEqual('Titanic');
        });

        it('does not find movie with unexisting director', async () => {
            const movieService = new MovieService();
            await createMovie({ title: 'Titanic', director: 'James Cameron' });

            const movie = await movieService.searchMoviesByDirector('James Cameron 15');

            expect(movie).toEqual([]);
        });
    });

    describe('#update', () => {
        it('updates movie\'s data with valid id', async () => {
            const movieService = new MovieService();
            const added = await createMovie({ title: 'Titanic', director: 'James Cameron' });

            await movieService.update(added.id, { title: 'Titanic 2' });

            const movie = await MovieModel.query().findOne({ title: 'Titanic 2' });

            expect(movie!.director).toEqual('James Cameron');
        });

        it('does not update anything when invalid id is passed', async () => {
            const movieService = new MovieService();
            const added = await createMovie({ title: 'Titanic', director: 'James Cameron' });

            await movieService.update(added.id + 1, { title: 'Titanic 2' });

            const movie1 = await MovieModel.query().findById(added.id);
            const movie2 = await MovieModel.query().findOne({ title: 'Titanic 2' });

            expect(movie1!.title).toEqual('Titanic');
            expect(movie1!.director).toEqual('James Cameron');
            expect(movie2).toBeUndefined();
        });
    });
});