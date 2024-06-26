import '../../styles/App.css'
import {useState} from "react";
import FilteredTable from "../FilteredTable.tsx";
import {RoleClient} from "../../webclients/role/RoleClient.ts";
import {FilterRoleCriteria} from "../../webclients/role/FilterRoleCriteria.ts";
import {Role} from "../../webclients/role/Role.ts";

function RolesPage() {
    const rolesClient = RoleClient.getInstance()
    const [roles, setRoles] = useState<Role[]>([]);

    const fetchData = async (): Promise<Role[]> => {
        try {
            const data = await rolesClient.getAllRoles()
            console.log(data)
            if (data) {
                setRoles(data)
                return data
            }
            return []
        } catch (error) {
            console.error('Error fetching data:', error);
            return []
        }
    }

    const renderRow = (role: Role) => (
        <tr key={role.id}>
            <td>{role.id}</td>
            <td>{role.name}</td>
            <td>{role.weight}</td>
            <td>{role.height}</td>
            <td>{role.eyeColor}</td>
            <td>{role.hairColor}</td>
            <td>{role.skinColor}</td>
            <td>{role.gender}</td>
            <td>{role.nationalityName}</td>
            <td>{role.description}</td>
        </tr>
    );


    return (
        <div>
            <h1>Роли</h1>
            <FilteredTable<Role, FilterRoleCriteria>
                fetchData={fetchData}
                renderRow={renderRow}
                FilterComponent={undefined}
                tableHeaders={["ID", "Название роли", "Предпочтительный вес", "Предпочтительный рост", "Предпочтительный цвет глаз", "Предпочтительный цвет волос", "Предпочтительный цвет кожи", "Предпочтительный пол", "Предпочтительная национальность", "Описание"]}
                tableData={roles}
                filterInitialState={{}}
            />
            <hr/>
            <label>
                <b>Количество:</b> {roles.length}.
            </label>
        </div>
    )
}

export default RolesPage
