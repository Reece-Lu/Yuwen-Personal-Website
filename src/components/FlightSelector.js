import React, { useState, useEffect } from 'react';
import { Box, Autocomplete, TextField, Typography } from '@mui/material';

const FlightSelector = ({ flightsData, onSelectionChange }) => {
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

    // 舱位选项
    const cabinOptions = [
        { label: '头等', value: '头等' },
        { label: '商务', value: '商务' },
        { label: '超经', value: '超经' },
        { label: '经济', value: '经济' }
    ];

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
    }, [selectedDepartureFirstLeg, selectedArrivalFirstLeg, selectedCabinFirstLeg, selectedDepartureSecondLeg, selectedArrivalSecondLeg, selectedCabinSecondLeg, onSelectionChange]);

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>第一段</Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
                {/* 第一段-出发机场 */}
                <Autocomplete
                    options={departureAirports}
                    getOptionLabel={(option) => option.label}
                    value={selectedDepartureFirstLeg} // 确保 value 正确绑定
                    onChange={(event, value) => setSelectedDepartureFirstLeg(value)}
                    isOptionEqualToValue={(option, value) => option.value === value?.value} // 自定义比较方式
                    renderInput={(params) => (
                        <TextField {...params} label="选择出发机场" variant="outlined" />
                    )}
                    sx={{ width: 300, mb: 2 }}
                    ListboxProps={{
                        style: {
                            maxHeight: '300px',
                            overflow: 'auto',
                            display: 'block',
                        },
                    }}
                />

                {/* 第一段-到达机场 */}
                <Autocomplete
                    options={arrivalAirports}
                    getOptionLabel={(option) => option.label}
                    value={selectedArrivalFirstLeg} // 确保 value 正确绑定
                    onChange={(event, value) => setSelectedArrivalFirstLeg(value)}
                    isOptionEqualToValue={(option, value) => option.value === value?.value} // 自定义比较方式
                    renderInput={(params) => (
                        <TextField {...params} label="选择到达机场" variant="outlined" />
                    )}
                    sx={{ width: 300, mb: 2 }}
                    ListboxProps={{
                        style: {
                            maxHeight: '300px',
                            overflow: 'auto',
                            display: 'block',
                        },
                    }}
                    disabled={!selectedDepartureFirstLeg}
                />

                {/* 第一段-舱位选择 */}
                <Autocomplete
                    options={cabinOptions}
                    getOptionLabel={(option) => option.label}
                    value={selectedCabinFirstLeg} // 确保 value 正确绑定
                    onChange={(event, value) => setSelectedCabinFirstLeg(value)}
                    isOptionEqualToValue={(option, value) => option.value === value?.value} // 自定义比较方式
                    renderInput={(params) => (
                        <TextField {...params} label="选择舱位" variant="outlined" />
                    )}
                    sx={{ width: 150, mb: 2 }}
                    ListboxProps={{
                        style: {
                            maxHeight: '300px',
                            overflow: 'auto',
                            display: 'block',
                        },
                    }}
                />
            </Box>

            <Typography variant="h6" gutterBottom>第二段</Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
                {/* 第二段-出发机场 */}
                <TextField
                    label="第二段出发机场"
                    variant="outlined"
                    value={selectedDepartureSecondLeg?.label || ''}
                    sx={{ width: 300, mb: 2 }}
                    InputProps={{
                        readOnly: true,
                    }}
                />

                {/* 第二段-到达机场 */}
                <Autocomplete
                    options={secondArrivalAirports}
                    getOptionLabel={(option) => option.label}
                    value={selectedArrivalSecondLeg} // 确保 value 正确绑定
                    onChange={(event, value) => setSelectedArrivalSecondLeg(value)}
                    isOptionEqualToValue={(option, value) => option.value === value?.value} // 自定义比较方式
                    renderInput={(params) => (
                        <TextField {...params} label="选择到达机场" variant="outlined" />
                    )}
                    sx={{ width: 300, mb: 2 }}
                    ListboxProps={{
                        style: {
                            maxHeight: '300px',
                            overflow: 'auto',
                            display: 'block',
                        },
                    }}
                    disabled={!selectedDepartureSecondLeg}
                />

                {/* 第二段-舱位选择 */}
                <Autocomplete
                    options={cabinOptions}
                    getOptionLabel={(option) => option.label}
                    value={selectedCabinSecondLeg} // 确保 value 正确绑定
                    onChange={(event, value) => setSelectedCabinSecondLeg(value)}
                    isOptionEqualToValue={(option, value) => option.value === value?.value} // 自定义比较方式
                    renderInput={(params) => (
                        <TextField {...params} label="选择舱位" variant="outlined" />
                    )}
                    sx={{ width: 150, mb: 2 }}
                    ListboxProps={{
                        style: {
                            maxHeight: '300px',
                            overflow: 'auto',
                            display: 'block',
                        },
                    }}
                    disabled={!selectedDepartureSecondLeg}
                />
            </Box>
        </Box>
    );
};

export default FlightSelector;