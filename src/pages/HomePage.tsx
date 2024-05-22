import {Link, Outlet, Route, Routes} from "react-router-dom";
import EmployeesPage from "./employees/EmployeesPage.tsx";
import PlaysPage from "./plays/PlaysPage.tsx";
import "../HomePage.css"
import AuthorsPage from "./authors/AuthorsPage.tsx";
import CastingsPage from "./castings/CastingsPage.tsx";
import React from "react";
import PerformancesPage from "./performances/PerformancesPage.tsx";
import SubscriptionsPage from "./subscriptions/SubscriptionsPage.tsx";
import RolesPage from "./roles/RolesPage.tsx";
import ActorsPage from "./actors/ActorsPage.tsx";

export default function HomeApp() {
    return (
        <Routes>
            <Route path="/" element={<Layout/>}>
                <Route path="employees" element={<EmployeesPage/>}/>
                <Route path="plays" element={<PlaysPage/>}/>
                <Route path="performances" element={<PerformancesPage/>}/>
                <Route path="actors" element={<ActorsPage/>}/>
                <Route path="authors" element={<AuthorsPage/>}/>
                <Route path="incomes" element={<PlaysPage/>}/>
                <Route path="tickets" element={<PlaysPage/>}/>
                <Route path="castings" element={<CastingsPage/>}/>
                <Route path="roles" element={<RolesPage/>}/>
                <Route path="subscriptions" element={<SubscriptionsPage/>}/>
            </Route>
            {/*<Route path="*" element={<NoMatch />} />*/}
        </Routes>
    );
}

function Layout() {
    return (
        <div>
            <div>
                <nav>
                    <h1>Большой театр</h1>
                    <Link to="/" className="nav-link">Домашняя страница</Link>
                    <Link to="/employees" className="nav-link">Работники театра</Link>
                    <Link to="/plays" className="nav-link">Пьесы</Link>
                    <Link to="/performances" className="nav-link">Спектакли</Link>
                    <Link to="/authors" className="nav-link">Авторы</Link>
                    <Link to="/actors" className="nav-link">Актёры</Link>
                    <Link to="/castings" className="nav-link">Кастинги</Link>
                    <Link to="/roles" className="nav-link">Роли</Link>
                    <Link to="/incomes" className="nav-link">Доходы</Link>
                    <Link to="/tickets" className="nav-link">Свободные места</Link>
                    <Link to="/subscriptions" className="nav-link">Оформление абонемента</Link>
                    {/*    <li>*/}
                    {/*        /!* Use a normal <a> when linking to the "Inbox" app so the browser*/}
                    {/*does a full document reload, which is what we want when exiting*/}
                    {/*this app and entering another so we execute its entry point in*/}
                    {/*inbox/main.jsx. *!/*/}
                    {/*        <a href="/inbox">Inbox</a>*/}
                    {/*    </li>*/}
                </nav>
            </div>
            <hr/>
            <div>
                <Outlet/>
            </div>
        </div>
    );
}