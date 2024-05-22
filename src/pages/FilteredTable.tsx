import React, {useEffect, useState} from "react";

interface FilteredTableProps<DataType, FilterCriteria> {
    fetchData: (filters: FilterCriteria) => Promise<DataType[]>;
    filterInitialState: FilterCriteria;
    renderRow: (dataItem: DataType, index: number) => React.ReactNode;
    FilterComponent: React.FC<{ onFilterChange: (filters: FilterCriteria) => void }> | undefined;
    tableHeaders: string[];
    tableData: DataType[];
}

const FilteredTable = <DataType, FilterCriteria>({
                                                     fetchData,
                                                     filterInitialState,
                                                     renderRow,
                                                     FilterComponent,
                                                     tableHeaders,
                                                     tableData
                                                 }: FilteredTableProps<DataType, FilterCriteria>) => {
    const [filters, setFilters] = useState<FilterCriteria>(filterInitialState);

    const handleFilterChange = (newFilters: FilterCriteria) => {
        setFilters(newFilters);
    };

    useEffect(() => {
        const fetchDataAndUpdate = async () => {
            try {
                fetchData(filters).then();
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchDataAndUpdate().then();
    }, [filters]);

    return (
        <div className="filtered-table-container">
            {FilterComponent && <FilterComponent
                onFilterChange={handleFilterChange}
            />}
            <div className="table-container">
                <table className="table">
                    <thead className="thead-dark">
                    <tr>
                        {tableHeaders.map((header, index) => (
                            <th key={index}>{header}</th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {tableData.map((item, index) => (
                        renderRow(item, index)
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default FilteredTable;