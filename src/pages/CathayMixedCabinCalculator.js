import React, { useState } from 'react';
import { Box, Grid, Typography, Button, Alert } from '@mui/material';
import flightsData from '../data/cx_flights_with_distances.json';
import FlightSelector from "../components/FlightSelector";
import mileageChart from '../data/mileage_chart.json'; // 导入mileage_chart.json
import routes from '../data/routes.min.js';
import CustomButton from '../components/CustomButton';

const CathayMixedCabinCalculator = () => {
    const [flightSelections, setFlightSelections] = useState({
        firstLegDeparture: null,
        firstLegArrival: null,
        firstLegCabin: null,
        secondLegDeparture: null,
        secondLegArrival: null,
        secondLegCabin: null,
    });
    const [firstLegDistance, setFirstLegDistance] = useState(null);
    const [secondLegDistance, setSecondLegDistance] = useState(null);
    const [flightList1, setFlightList1] = useState([]);
    const [flightList2, setFlightList2] = useState([]);
    const [error, setError] = useState(false);
    const [totalPoints, setTotalPoints] = useState(null);
    const [ratios, setRatios] = useState({}); // 保存每个舱位的比例

    const handleSelectionChange = (selections) => {
        setFlightSelections(selections);
    };

    // 计算总里程数的函数
    const calculateTotalPointsNeeded = (firstLegDistance, secondLegDistance) => {
        const totalMiles = (firstLegDistance || 0) + (secondLegDistance || 0);

        if (totalMiles === 0) {
            return '无法计算总里程数';
        }
        console.log(totalMiles);

        // 根据 totalMiles 匹配 category
        const category = mileageChart.find(item => totalMiles <= item.range);

        console.log(category);

        if (!category) {
            return '无法找到适合的航程类别';
        }

        // 计算比例
        const economyRatio = category.economy / totalMiles;
        const premiumEconomyRatio = category.premium_economy / totalMiles;
        const businessRatio = category.business / totalMiles;
        const firstClassRatio = category.first_class ? category.first_class / totalMiles : null;

        // 保存比例到 state 中，以便展示
        setRatios({
            economyRatio: economyRatio.toFixed(2),
            premiumEconomyRatio: premiumEconomyRatio.toFixed(2),
            businessRatio: businessRatio.toFixed(2),
            firstClassRatio: firstClassRatio ? firstClassRatio.toFixed(2) : 'N/A',
        });

        // 根据用户选择舱位计算第一段和第二段所需的里程数
        const cabinRatios = {
            '经济': economyRatio,
            '超经': premiumEconomyRatio,
            '商务': businessRatio,
            '头等': firstClassRatio
        };

        const firstLegCabin = flightSelections.firstLegCabin?.value;
        const secondLegCabin = flightSelections.secondLegCabin?.value;

        const firstLegPoints = cabinRatios[firstLegCabin] ?
            firstLegDistance * cabinRatios[firstLegCabin] : 0;
        const secondLegPoints = cabinRatios[secondLegCabin] ?
            secondLegDistance * cabinRatios[secondLegCabin] : 0;

        const totalPointsNeeded = firstLegPoints + secondLegPoints;

        console.log(totalPointsNeeded);

        if (!totalPointsNeeded) {
            return '无法计算所需里程数';
        }

        // 向上取整到最近的百位
        const roundedTotalPoints = Math.ceil(totalPointsNeeded / 100) * 100;

        console.log(roundedTotalPoints);

        return roundedTotalPoints.toFixed(0); // 返回整数形式的里程数
    };


    const calculateDistance = () => {
        if (!flightSelections.firstLegDeparture || !flightSelections.firstLegArrival ||
            !flightSelections.firstLegCabin || !flightSelections.secondLegDeparture ||
            !flightSelections.secondLegArrival || !flightSelections.secondLegCabin) {
            setError(true);
            return;
        }

        setError(false);

        // Helper function to get the distance from the routes data
        const getDistance = (departure, arrival) => {
            const departureRoutes = routes[departure]; // Get routes from departure airport
            if (!departureRoutes) return 0;
            const flightRoute = departureRoutes.find(route => route.destination === arrival);
            return flightRoute ? flightRoute.miles : 0;
        };

        // Get the distance for the first leg
        const firstLegDistance = getDistance(flightSelections.firstLegDeparture.value, flightSelections.firstLegArrival.value);
        setFirstLegDistance(firstLegDistance);

        // Get the distance for the second leg
        const secondLegDistance = getDistance(flightSelections.secondLegDeparture.value, flightSelections.secondLegArrival.value);
        setSecondLegDistance(secondLegDistance);

        // Set flight lists for UI
        setFlightList1(flightsData.filter(
            (flight) =>
                flight.departure_airport === flightSelections.firstLegDeparture.value &&
                flight.arrival_airport === flightSelections.firstLegArrival.value
        ));
        setFlightList2(flightsData.filter(
            (flight) =>
                flight.departure_airport === flightSelections.secondLegDeparture.value &&
                flight.arrival_airport === flightSelections.secondLegArrival.value
        ));

        // Ensure distances are calculated and use them in total points calculation
        if (firstLegDistance > 0 && secondLegDistance > 0) {
            const points = calculateTotalPointsNeeded(firstLegDistance, secondLegDistance);
            setTotalPoints(points);
        } else {
            setTotalPoints('无法计算所需里程数');
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>国泰航空混舱计算器</Typography>

            <FlightSelector flightsData={flightsData} onSelectionChange={handleSelectionChange} />

            <Grid container spacing={2} justifyContent="center">
                {/* 计算按钮 */}
                <Grid item xs={12} md={6}>
                    <CustomButton
                        text="计算"
                        onClick={calculateDistance}
                        variant="contained"
                        color="#005D63"
                        hoverColor="#004a4f"
                    />
                </Grid>

                {/* 重新计算按钮 */}
                <Grid item xs={12} md={6}>
                    <CustomButton
                        text="重新计算"
                        onClick={calculateDistance}
                        variant="outlined"
                        color="#005D63"
                        hoverColor="#004a4f"
                    />
                </Grid>

                {/* 错误提示 */}
                {error && (
                    <Grid item xs={12}>
                        <Alert severity="error" sx={{ mt: 2 }}>
                            请确认所有航班信息和舱位选择都填写完整！
                        </Alert>
                    </Grid>
                )}
            </Grid>


            <Grid container spacing={2} sx={{ mt: 4 }}>
                {/* 第一段航班列表 */}
                {flightList1.length > 0 && (
                    <Grid item xs={12}>
                        <Typography variant="h6">第一段航班列表:</Typography>
                        {flightList1.map((flight, index) => (
                            <Typography key={index}>
                                航班号: {flight.flight_number}, 路线: {flight.departure_airport} - {flight.arrival_airport}
                            </Typography>
                        ))}
                    </Grid>
                )}

                {/* 第二段航班列表 */}
                {flightList2.length > 0 && (
                    <Grid item xs={12}>
                        <Typography variant="h6">第二段航班列表:</Typography>
                        {flightList2.map((flight, index) => (
                            <Typography key={index}>
                                航班号: {flight.flight_number}, 路线: {flight.departure_airport} - {flight.arrival_airport}
                            </Typography>
                        ))}
                    </Grid>
                )}

                {/* 总所需里程数 */}
                {totalPoints && (
                    <Grid item xs={12}>
                        <Typography sx={{ fontWeight: 'bold', color: totalPoints === '无法计算所需里程数' ? 'red' : 'black' }}>
                            总所需里程数: {totalPoints}
                        </Typography>
                    </Grid>
                )}

                {/* 各舱位里程比例 */}
                {ratios && (
                    <Grid item xs={12}>
                        <Typography variant="h6">各舱位里程比例:</Typography>
                        <Typography>经济舱比例: {ratios.economyRatio}</Typography>
                        <Typography>特选经济舱比例: {ratios.premiumEconomyRatio}</Typography>
                        <Typography>商务舱比例: {ratios.businessRatio}</Typography>
                        <Typography>头等舱比例: {ratios.firstClassRatio}</Typography>
                    </Grid>
                )}
            </Grid>

            <Grid container spacing={2} sx={{ mt: 4 }}>
                {/* 第一段航程距离 */}
                {firstLegDistance !== null && (
                    <Grid item xs={12}>
                        <Typography>第一段航程距离: {firstLegDistance} 英里</Typography>
                    </Grid>
                )}

                {/* 第二段航程距离 */}
                {secondLegDistance !== null && (
                    <Grid item xs={12}>
                        <Typography>第二段航程距离: {secondLegDistance} 英里</Typography>
                    </Grid>
                )}
            </Grid>


        </Box>
    );
};

export default CathayMixedCabinCalculator;
