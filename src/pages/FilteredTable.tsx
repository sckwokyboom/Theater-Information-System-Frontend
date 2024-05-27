import React, {useEffect, useState} from "react";
import {Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from '@mui/material';

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
        <Box id="root" sx={{maxWidth: 1280, margin: '0 auto', padding: '2rem', textAlign: 'center'}}>
            {FilterComponent && (
                <Box sx={{mb: 2}}>
                    <FilterComponent onFilterChange={handleFilterChange}/>
                </Box>
            )}
            <TableContainer component={Paper} className="table-container">
                <Table className="table">
                    <TableHead>
                        <TableRow>
                            {tableHeaders.map((header, index) => (
                                <TableCell key={index}>{header}</TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tableData.map((item, index) => (
                            renderRow(item, index)
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default FilteredTable;
