import {Link, Outlet, Route, Routes} from "react-router-dom";
import EmployeesPage from "./employees/EmployeesPage.tsx";
import PlaysPage from "./plays/PlaysPage.tsx";
import "../HomePage.css"
import AuthorsPage from "./authors/AuthorsPage.tsx";
import CastingsPage from "./castings/CastingsPage.tsx";
import PerformancesPage from "./performances/PerformancesPage.tsx";
import SubscriptionsPage from "./subscriptions/SubscriptionsPage.tsx";
import RolesPage from "./roles/RolesPage.tsx";
import ActorsPage from "./actors/ActorsPage.tsx";
import TicketsPage from "./tickets/TicketsPage.tsx";
import FreePlacesPage from "./places/FreePlacesPage.tsx";
import PerformancesInfoPage from "./performancesinfo/PerformancesInfoPage.tsx";

export default function HomeApp() {
    return (
        <Routes>
            <Route path="/" element={<Layout/>}>
                <Route path="employees" element={<EmployeesPage/>}/>
                <Route path="plays" element={<PlaysPage/>}/>
                <Route path="performances" element={<PerformancesPage/>}/>
                <Route path="actors" element={<ActorsPage/>}/>
                <Route path="authors" element={<AuthorsPage/>}/>
                <Route path="castings" element={<CastingsPage/>}/>
                <Route path="tickets" element={<TicketsPage/>}/>
                <Route path="places" element={<FreePlacesPage/>}/>
                <Route path="roles" element={<RolesPage/>}/>
                <Route path="subscriptions" element={<SubscriptionsPage/>}/>
                <Route path="performancesinfo" element={<PerformancesInfoPage/>}/>
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
                    <Link to="/tickets" className="nav-link">Билеты</Link>
                    <Link to="/subscriptions" className="nav-link">Оформление абонемента</Link>
                    <Link to="/places" className="nav-link">Свободные места</Link>
                    <Link to="/performancesinfo" className="nav-link">Информация о спектакле</Link>
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