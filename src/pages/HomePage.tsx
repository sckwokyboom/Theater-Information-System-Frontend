import {Link, Outlet, Route, Routes} from "react-router-dom";
import EmployeesPage from "./employees/EmployeesPage.tsx";
import PlaysPage from "./plays/PlaysPage.tsx";
import "../HomePage.css"
import PerformancesPage from "./performances/PerformancesPage.tsx";

export default function HomeApp() {
    return (
        <Routes>
            <Route path="/" element={<Layout/>}>
                <Route path="employees" element={<EmployeesPage/>}/>
                <Route path="plays" element={<PlaysPage/>}/>
                <Route path="performances" element={<PerformancesPage/>}/>
                <Route path="actors" element={<PlaysPage/>}/>
                <Route path="authors" element={<PlaysPage/>}/>
                <Route path="incomes" element={<PlaysPage/>}/>
                <Route path="tickets" element={<PlaysPage/>}/>
                <Route path="castings" element={<PlaysPage/>}/>
                <Route path="roles" element={<PlaysPage/>}/>
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
                    <ul>
                        <li>
                            <Link to="/">Домашняя страница</Link>
                        </li>
                        <li>
                            <Link to="/employees">Работники театра</Link>
                        </li>
                        <li>
                            <Link to="/plays">Пьесы</Link>
                        </li>
                        <li>
                            <Link to="/performances">Спектакли</Link>
                        </li>
                        <li>
                            <Link to="/authors">Авторы</Link>
                        </li>
                        <li>
                            <Link to="/actors">Актёры</Link>
                        </li>
                        <li>
                            <Link to="/castings">Кастинги</Link>
                        </li>
                        <li>
                            <Link to="/roles">Роли</Link>
                        </li>
                        <li>
                            <Link to="/incomes">Доходы</Link>
                        </li>
                        <li>
                            <Link to="/tickets">Свободные места</Link>
                        </li>
                        {/*    <li>*/}
                        {/*        /!* Use a normal <a> when linking to the "Inbox" app so the browser*/}
                        {/*does a full document reload, which is what we want when exiting*/}
                        {/*this app and entering another so we execute its entry point in*/}
                        {/*inbox/main.jsx. *!/*/}
                        {/*        <a href="/inbox">Inbox</a>*/}
                        {/*    </li>*/}
                    </ul>
                </nav>
            </div>
            <div>
                <Outlet/>
            </div>
        </div>
    );
}