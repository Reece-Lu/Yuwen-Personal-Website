import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    Paper,
    Checkbox,
    Toolbar,
    Typography,
    TableSortLabel,
    ThemeProvider,
    createTheme
} from '@mui/material';

const CsvTable = ({ filePath, tableTitle, defaultRowsPerPage, primaryColor }) => {
    const [data, setData] = useState([]);
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('');
    const [selected, setSelected] = useState([]);
    const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage || 5);
    const [page, setPage] = useState(0);

    // Custom theme to change primary color and set typography
    const theme = createTheme({
        palette: {
            primary: {
                main: primaryColor || '#9D42AD', // Set the color based on props, default to #9D42AD
            },
        },
        typography: {
            fontFamily: 'Nunito, Arial, sans-serif',
        },
    });

    useEffect(() => {
        // Read CSV file
        Papa.parse(filePath, {
            download: true,
            header: true,
            complete: (result) => {
                setData(result.data);
                if (result.data.length > 0) {
                    setOrderBy(Object.keys(result.data[0])[0]);
                    setSelected(result.data.map((row) => row[Object.keys(result.data[0])[0]])); // Default select all rows
                }
            },
        });
    }, [filePath]);

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = data.map((n) => n[orderBy]);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, name) => {
        const selectedIndex = selected.indexOf(name);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1)
            );
        }

        setSelected(newSelected);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const isSelected = (name) => selected.indexOf(name) !== -1;

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ width: '100%' }}>
                <Paper sx={{ width: '100%', mb: 2 }}>
                    <Toolbar>
                        <Typography
                            sx={{ flex: '1 1 100%' }}
                            variant="h6"
                            id="tableTitle"
                            component="div"
                        >
                            {tableTitle}
                        </Typography>
                    </Toolbar>
                    <TableContainer>
                        <Table
                            sx={{ minWidth: 750 }}
                            aria-labelledby="tableTitle"
                            size="small" // Dense padding is enabled by setting size to "small"
                        >
                            <TableHead>
                                <TableRow>
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            color="primary"
                                            indeterminate={selected.length > 0 && selected.length < data.length}
                                            checked={data.length > 0 && selected.length === data.length}
                                            onChange={handleSelectAllClick}
                                            inputProps={{
                                                'aria-label': 'select all data',
                                            }}
                                        />
                                    </TableCell>
                                    {data.length > 0 && Object.keys(data[0]).map((key) => (
                                        <TableCell
                                            key={key}
                                            sortDirection={orderBy === key ? order : false}
                                            sx={{
                                                whiteSpace: 'nowrap', // Prevent text from breaking to a new line
                                                overflow: 'hidden', // Hide overflow content
                                                textOverflow: 'ellipsis', // Add ellipsis for overflowing text
                                                fontFamily: 'Nunito, Arial, sans-serif', // Apply the theme typography to attributes
                                            }}
                                        >
                                            <TableSortLabel
                                                active={orderBy === key}
                                                direction={orderBy === key ? order : 'asc'}
                                                onClick={(event) => handleRequestSort(event, key)}
                                                hideSortIcon={true} // Hides the sorting auxiliary text like "sorted descending"
                                            >
                                                {key}
                                            </TableSortLabel>
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((row, index) => {
                                        const rowIdentifier = row[orderBy]; // Use orderBy to identify row
                                        const isItemSelected = isSelected(rowIdentifier);
                                        const labelId = `enhanced-table-checkbox-${index}`;

                                        return (
                                            <TableRow
                                                hover
                                                onClick={(event) => handleClick(event, rowIdentifier)}
                                                role="checkbox"
                                                aria-checked={isItemSelected}
                                                tabIndex={-1}
                                                key={index}
                                                selected={isItemSelected}
                                                sx={{ height: 40 }} // Set fixed row height
                                            >
                                                <TableCell padding="checkbox">
                                                    <Checkbox
                                                        color="primary"
                                                        checked={isItemSelected}
                                                        inputProps={{
                                                            'aria-labelledby': labelId,
                                                        }}
                                                    />
                                                </TableCell>
                                                {Object.keys(row).map((key) => (
                                                    <TableCell
                                                        key={key}
                                                        align="left"
                                                        sx={{
                                                            whiteSpace: 'nowrap', // Prevent line breaks
                                                            overflow: 'hidden', // Hide overflow content
                                                            textOverflow: 'ellipsis', // Add ellipsis for overflowing text
                                                            fontFamily: 'Nunito, Arial, sans-serif', // Apply the theme typography to attributes
                                                        }}
                                                    >
                                                        {row[key]}
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        );
                                    })}
                                {emptyRows > 0 && (
                                    <TableRow
                                        style={{
                                            height: 40 * emptyRows, // Match the fixed row height
                                        }}
                                    >
                                        <TableCell colSpan={6} />
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={data.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Paper>
            </Box>
        </ThemeProvider>
    );
};

export default CsvTable;
