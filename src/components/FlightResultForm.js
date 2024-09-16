import React from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Chip, Paper, Grid } from '@mui/material';

const FlightResultForm = ({
                              firstLegDeparture,
                              firstLegArrival,
                              secondLegDeparture,
                              secondLegArrival,
                              firstLegDistance,
                              secondLegDistance,
                              totalPoints,
                              flightList1,
                              flightList2
                          }) => {

    // 动态生成地图URL
    const mapRoute = `${firstLegDeparture}-${firstLegArrival},${secondLegDeparture}-${secondLegArrival}`;
    const mapUrl = `http://www.gcmap.com/map?P=${mapRoute}&PM=b:disc7+%N&MS=wls&MP=r`;

    return (
        <Box sx={{ p: 3, borderRadius: '8px', mt: 2 }}>
            <TableContainer component={Paper} elevation={0}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center" sx={{ fontWeight: 'bold', width: '30px' }}>航程</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold', width: '20px' }}>起点</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold', width: '20px' }}>终点</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold', width: '30px' }}>距离</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {/* 第一段航程 */}
                        <TableRow>
                            <TableCell align="center">1</TableCell>
                            <TableCell align="center">{firstLegDeparture || '???'}</TableCell>
                            <TableCell align="center">{firstLegArrival || '???'}</TableCell>
                            <TableCell align="center">{firstLegDistance || '???'}</TableCell>
                        </TableRow>

                        {/* 第二段航程 */}
                        <TableRow>
                            <TableCell align="center">2</TableCell>
                            <TableCell align="center">{secondLegDeparture || '???'}</TableCell>
                            <TableCell align="center">{secondLegArrival || '???'}</TableCell>
                            <TableCell align="center">{secondLegDistance || '???'}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>

            {/* 显示总距离和总里程数 */}
            <Grid container spacing={2} sx={{ mt: 1 }} alignItems="center">
                <Grid item xs={12} md={6}>
                    <Typography sx={{ fontWeight: 'bold', textAlign: { xs: 'center', md: 'right' } }}>
                        总距离: {(firstLegDistance + secondLegDistance) || 'N/A'} 英里
                    </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Typography sx={{ fontWeight: 'bold', textAlign: { xs: 'center', md: 'left' } }}>
                        总里程数: {totalPoints || 'N/A'}
                    </Typography>
                </Grid>
            </Grid>

            {/* 显示航班路线图 */}
            <Box sx={{ mt: 4, textAlign: 'center' }}>
                <img src={mapUrl} alt="Flight Route Map" style={{ maxWidth: '100%', height: 'auto' }} />
            </Box>

            {/* 航班号列表 */}
            <Box sx={{ p: 3, borderRadius: '8px', mt: 2 }}>
                <Typography sx={{ fontWeight: 'bold'}}>可选航班:</Typography>

                <Typography variant="body1" sx={{ mt: 1 }}>
                    航程 1:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 , mt: 0.5}}>
                    {flightList1.map((flight, index) => (
                        <Chip
                            key={index}
                            label={flight.flight_number}
                            clickable
                            sx={{ backgroundColor: '#E0E0E0', color: 'black', borderRadius: '16px' }}
                        />
                    ))}
                </Box>

                <Typography variant="body1" sx={{ mt: 2 }}>
                    航程 2:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 0.5}}>
                    {flightList2.map((flight, index) => (
                        <Chip
                            key={index}
                            label={flight.flight_number}
                            clickable
                            sx={{ backgroundColor: '#E0E0E0', color: 'black', borderRadius: '16px' }}
                        />
                    ))}
                </Box>
            </Box>

        </Box>
    );
};

export default FlightResultForm;
