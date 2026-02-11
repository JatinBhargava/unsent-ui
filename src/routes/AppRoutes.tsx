import {BrowserRouter, Routes, Route} from "react-router-dom";
import Home from "../pages/Home";
import Register from "../pages/Register";
import Login from "../pages/Login";
import Diaries from "../pages/Dairy";
import WinOfTheDay from "../pages/WinOfTheDay";



export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/diaries" element={<Diaries />} />
                <Route path="/wod" element={<WinOfTheDay />} />
            </Routes>
        </BrowserRouter>
    );
}
