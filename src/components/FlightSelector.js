import React, { useState, useEffect } from 'react';
import { Box, Grid, Autocomplete, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

const FlightSelector = ({ flightsData, onSelectionChange, reset, labels }) => {
    // 第一段
    const [departureAirports, setDepartureAirports] = useState([]);
    const [arrivalAirports, setArrivalAirports] = useState([]);
    const [selectedDepartureFirstLeg, setSelectedDepartureFirstLeg] = useState(null);
    const [selectedArrivalFirstLeg, setSelectedArrivalFirstLeg] = useState(null);
    const [selectedCabinFirstLeg, setSelectedCabinFirstLeg] = useState(null);

    // 第二段
    const [secondArrivalAirports, setSecondArrivalAirports] = useState([]);
    const [selectedDepartureSecondLeg, setSelectedDepartureSecondLeg] = useState(null);
    const [selectedArrivalSecondLeg, setSelectedArrivalSecondLeg] = useState(null);
    const [selectedCabinSecondLeg, setSelectedCabinSecondLeg] = useState(null);
    const { t, i18n } = useTranslation();

    const cabinOptions = [
        { label: t('first_class'), value: '头等' },
        { label: t('business_class'), value: '商务' },
        { label: t('premium_economy'), value: '超经' },
        { label: t('economy_class'), value: '经济' }
    ];

    // 加载所有出发机场，提取唯一的出发机场代码
    useEffect(() => {
        const airportSet = new Set();
        flightsData.forEach((flight) => {
            airportSet.add(flight.departure_airport);
        });
        const airportOptions = Array.from(airportSet).map((airportCode) => ({
            label: airportCode,
            value: airportCode,
        }));
        setDepartureAirports(airportOptions);
    }, [flightsData]);

    // 当用户选择了第一段的出发机场时，筛选该出发机场的到达机场列表
    useEffect(() => {
        if (selectedDepartureFirstLeg) {
            const arrivalSet = new Set();
            flightsData.forEach((flight) => {
                if (flight.departure_airport === selectedDepartureFirstLeg.value) {
                    arrivalSet.add(flight.arrival_airport);
                }
            });
            const arrivalOptions = Array.from(arrivalSet).map((airportCode) => ({
                label: airportCode,
                value: airportCode,
            }));
            setArrivalAirports(arrivalOptions);
        }
    }, [selectedDepartureFirstLeg, flightsData]);

    // 当用户选择了第一段的到达机场时，第二段的出发机场会自动设置为第一段的到达机场
    useEffect(() => {
        if (selectedArrivalFirstLeg) {
            setSelectedDepartureSecondLeg(selectedArrivalFirstLeg); // 第二段出发机场等于第一段到达机场

            // 筛选第二段的到达机场列表
            const secondArrivalSet = new Set();
            flightsData.forEach((flight) => {
                if (flight.departure_airport === selectedArrivalFirstLeg.value) {
                    secondArrivalSet.add(flight.arrival_airport);
                }
            });
            const secondArrivalOptions = Array.from(secondArrivalSet).map((airportCode) => ({
                label: airportCode,
                value: airportCode,
            }));
            setSecondArrivalAirports(secondArrivalOptions);
        }
    }, [selectedArrivalFirstLeg, flightsData]);

    // 当 reset 状态为 true 时，重置所有选择
    useEffect(() => {
        if (reset) {
            setSelectedDepartureFirstLeg(null);
            setSelectedArrivalFirstLeg(null);
            setSelectedCabinFirstLeg(null);
            setSelectedDepartureSecondLeg(null);
            setSelectedArrivalSecondLeg(null);
            setSelectedCabinSecondLeg(null);
            setArrivalAirports([]);
            setSecondArrivalAirports([]);
        }
    }, [reset]);


    // 每当选择更改时，将 6 个参数返回给父组件
    useEffect(() => {
        onSelectionChange({
            firstLegDeparture: selectedDepartureFirstLeg,
            firstLegArrival: selectedArrivalFirstLeg,
            firstLegCabin: selectedCabinFirstLeg,
            secondLegDeparture: selectedDepartureSecondLeg,
            secondLegArrival: selectedArrivalSecondLeg,
            secondLegCabin: selectedCabinSecondLeg,
        });
    }, [
        selectedDepartureFirstLeg,
        selectedArrivalFirstLeg,
        selectedCabinFirstLeg,
        selectedDepartureSecondLeg,
        selectedArrivalSecondLeg,
        selectedCabinSecondLeg,
        onSelectionChange
    ]);

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 1 }}>{labels.firstLegTitle}</Typography>
            <Grid container spacing={2}>
                {/* 第一段-出发机场 */}
                <Grid item xs={12} md={4}>
                    <Autocomplete
                        options={departureAirports}
                        getOptionLabel={(option) => option.label}
                        value={selectedDepartureFirstLeg}
                        onChange={(event, value) => setSelectedDepartureFirstLeg(value)}
                        renderInput={(params) => (
                            <TextField {...params} label={labels.departure} variant="outlined" />
                        )}
                        ListboxProps={{
                            style: {
                                maxHeight: '300px',
                                overflow: 'auto',
                                display: 'block',
                            },
                        }}
                    />
                </Grid>

                {/* 第一段-到达机场 */}
                <Grid item xs={12} md={4}>
                    <Autocomplete
                        options={arrivalAirports}
                        getOptionLabel={(option) => option.label}
                        value={selectedArrivalFirstLeg}
                        onChange={(event, value) => setSelectedArrivalFirstLeg(value)}
                        disabled={!selectedDepartureFirstLeg}
                        renderInput={(params) => (
                            <TextField {...params} label={labels.arrival} variant="outlined" />
                        )}
                        ListboxProps={{
                            style: {
                                maxHeight: '300px',
                                overflow: 'auto',
                                display: 'block',
                            },
                        }}
                    />
                </Grid>

                {/* 第一段-舱位选择 */}
                <Grid item xs={12} md={4}>
                    <Autocomplete
                        options={cabinOptions}
                        getOptionLabel={(option) => option.label}
                        value={selectedCabinFirstLeg}
                        onChange={(event, value) => setSelectedCabinFirstLeg(value)}
                        renderInput={(params) => (
                            <TextField {...params} label={labels.cabin} variant="outlined" />
                        )}
                        ListboxProps={{
                            style: {
                                maxHeight: '300px',
                                overflow: 'auto',
                                display: 'block',
                            },
                        }}
                    />
                </Grid>
            </Grid>

            <Typography variant="h6" gutterBottom sx={{ mt: 2, mb: 1 }}>{labels.secondLegTitle}</Typography>
            <Grid container spacing={2}>
                {/* 第二段-出发机场 */}
                <Grid item xs={12} md={4}>
                    <Autocomplete
                        options={[{ label: selectedDepartureSecondLeg?.label || '' }]}
                        getOptionLabel={(option) => option.label}
                        value={selectedDepartureSecondLeg}
                        disabled
                        renderInput={(params) => (
                            <TextField {...params} label={labels.departure} variant="outlined" />
                        )}
                        ListboxProps={{
                            style: {
                                maxHeight: '300px',
                                overflow: 'auto',
                                display: 'block',
                            },
                        }}
                    />
                </Grid>

                {/* 第二段-到达机场 */}
                <Grid item xs={12} md={4}>
                    <Autocomplete
                        options={secondArrivalAirports}
                        getOptionLabel={(option) => option.label}
                        value={selectedArrivalSecondLeg}
                        onChange={(event, value) => setSelectedArrivalSecondLeg(value)}
                        disabled={!selectedDepartureSecondLeg}
                        renderInput={(params) => (
                            <TextField {...params} label={labels.arrival} variant="outlined" />
                        )}
                        ListboxProps={{
                            style: {
                                maxHeight: '300px',
                                overflow: 'auto',
                                display: 'block',
                            },
                        }}
                    />
                </Grid>

                {/* 第二段-舱位选择 */}
                <Grid item xs={12} md={4}>
                    <Autocomplete
                        options={cabinOptions}
                        getOptionLabel={(option) => option.label}
                        value={selectedCabinSecondLeg}
                        onChange={(event, value) => setSelectedCabinSecondLeg(value)}
                        renderInput={(params) => (
                            <TextField {...params} label={labels.cabin} variant="outlined" />
                        )}
                        disabled={!selectedDepartureSecondLeg}
                        ListboxProps={{
                            style: {
                                maxHeight: '300px',
                                overflow: 'auto',
                                display: 'block',
                            },
                        }}
                    />
                </Grid>
            </Grid>
        </Box>
    );
};

export default FlightSelector;
