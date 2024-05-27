import {Route, Routes} from 'react-router-dom';
import EmployeesPage from './employees/EmployeesPage';
import PlaysPage from './plays/PlaysPage';
import AuthorsPage from './authors/AuthorsPage';
import CastingsPage from './castings/CastingsPage';
import PerformancesPage from './performances/PerformancesPage';
import SubscriptionsPage from './subscriptions/SubscriptionsPage';
import RolesPage from './roles/RolesPage';
import ActorsPage from './actors/ActorsPage';
import TicketsPage from './tickets/TicketsPage';
import FreePlacesPage from './places/FreePlacesPage';
import PerformancesInfoPage from './performancesinfo/PerformancesInfoPage';
import Layout from './Layout';
import HomePageContent from './HomePageContent';
import '../styles/App.css';

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<Layout/>}>
                <Route index element={<HomePageContent/>}/>
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
        </Routes>
    );
}
