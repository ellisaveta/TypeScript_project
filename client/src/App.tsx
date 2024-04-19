import { MoviesLibrary } from "./pages/MoviesLibrary";
import './App.css'
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { PrivateOutlet } from "./components/PrivateOutlet";
import { PublicOutlet } from "./components/PublicOutlet";
import { Login } from "./pages/Login";
import { PageLayout } from "./layouts/PageLayout";
import { Home } from "./pages/Home";
import { Registration } from "./pages/Registration";
import { CurrentUserProvider } from "./contexts/CurrentUserContext";
import { UserPreferencesProvider } from "./contexts/UserPreferencesContext";
import { MovieDetails } from "./pages/MovieDetails";

export function App() {

    return (
        <CurrentUserProvider>
            <UserPreferencesProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path='/' element={<PageLayout element={<Home />} />} />
                        <Route path='/' element={<PublicOutlet />}>
                            <Route path='/login' element={<PageLayout element={<Login />} />} />
                            <Route path='/registration' element={<PageLayout element={<Registration />} />} />
                        </Route>
                        <Route path='/' element={<PrivateOutlet />}>
                            <Route path='/movies' element={<PageLayout element={<MoviesLibrary />} />} />
                            <Route path='/movies/:id' element={<PageLayout element={<MovieDetails />} />} />
                        </Route>
                        <Route path='*' element={<Navigate to='/' />} />
                    </Routes>
                </BrowserRouter>
            </UserPreferencesProvider>
        </CurrentUserProvider>
    );
}