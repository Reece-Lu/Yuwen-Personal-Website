import React, { useState } from 'react';
import { Box, Typography, Button, Alert } from '@mui/material';
import flightsData from '../data/cx_flights_with_distances.json';
import FlightSelector from "../components/FlightSelector";
import mileageChart from '../data/mileage_chart.json'; // 导入mileage_chart.json

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

        const firstLegPoints = cabinRatios[flightSelections.firstLegCabin?.value] ?
            firstLegDistance * cabinRatios[flightSelections.firstLegCabin?.value] : 0;
        const secondLegPoints = cabinRatios[flightSelections.secondLegCabin?.value] ?
            secondLegDistance * cabinRatios[flightSelections.secondLegCabin?.value] : 0;

        const totalPointsNeeded = firstLegPoints + secondLegPoints;

        console.log(totalPointsNeeded);

        return totalPointsNeeded ? totalPointsNeeded.toFixed(2) : '无法计算所需里程数';
    };

    const calculateDistance = () => {
        if (!flightSelections.firstLegDeparture || !flightSelections.firstLegArrival ||
            !flightSelections.firstLegCabin || !flightSelections.secondLegDeparture ||
            !flightSelections.secondLegArrival || !flightSelections.secondLegCabin) {
            setError(true);
            return;
        }

        setError(false);

        // 获取第一段航班的航班列表和距离
        const firstLegFlights = flightsData.filter(
            (flight) =>
                flight.departure_airport === flightSelections.firstLegDeparture.value &&
                flight.arrival_airport === flightSelections.firstLegArrival.value
        );
        setFlightList1(firstLegFlights);

        if (firstLegFlights.length > 0) {
            const firstDistance = parseFloat(firstLegFlights[0].distance) || 0;
            setFirstLegDistance(firstDistance);
        } else {
            setFirstLegDistance(0); // 如果没有匹配到航班，设置距离为0
        }

        // 获取第二段航班的航班列表和距离
        const secondLegFlights = flightsData.filter(
            (flight) =>
                flight.departure_airport === flightSelections.secondLegDeparture.value &&
                flight.arrival_airport === flightSelections.secondLegArrival.value
        );
        setFlightList2(secondLegFlights);

        if (secondLegFlights.length > 0) {
            const secondDistance = parseFloat(secondLegFlights[0].distance) || 0;
            setSecondLegDistance(secondDistance);
        } else {
            setSecondLegDistance(0); // 如果没有匹配到航班，设置距离为0
        }

        // **直接在这里进行计算，确保每次点击时都能计算出来结果**
        if (firstLegFlights.length > 0 && secondLegFlights.length > 0) {
            const totalMiles = (parseFloat(firstLegFlights[0].distance) || 0) + (parseFloat(secondLegFlights[0].distance) || 0);
            const points = calculateTotalPointsNeeded(firstLegDistance, secondLegDistance);
            setTotalPoints(points);
        } else {
            setTotalPoints('无法计算所需里程数');
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>国泰航空混舱计算器</Typography>

            <FlightSelector
                flightsData={flightsData}
                onSelectionChange={handleSelectionChange}
            />

            <Box sx={{ mt: 4 }}>
                {firstLegDistance !== null && (
                    <Typography sx={{ mt: 2 }}>第一段航程距离: {firstLegDistance} 英里</Typography>
                )}

                {secondLegDistance !== null && (
                    <Typography sx={{ mt: 2 }}>第二段航程距离: {secondLegDistance} 英里</Typography>
                )}

                {/* 显示第一段航班列表 */}
                {flightList1.length > 0 && (
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="h6">第一段航班列表:</Typography>
                        {flightList1.map((flight, index) => (
                            <Typography key={index}>
                                航班号: {flight.flight_number}, 路线: {flight.departure_airport} - {flight.arrival_airport}
                            </Typography>
                        ))}
                    </Box>
                )}

                {/* 显示第二段航班列表 */}
                {flightList2.length > 0 && (
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="h6">第二段航班列表:</Typography>
                        {flightList2.map((flight, index) => (
                            <Typography key={index}>
                                航班号: {flight.flight_number}, 路线: {flight.departure_airport} - {flight.arrival_airport}
                            </Typography>
                        ))}
                    </Box>
                )}

                {/* 显示总里程数 */}
                {totalPoints && (
                    <Typography sx={{ mt: 4, fontWeight: 'bold', color: totalPoints === '无法计算所需里程数' ? 'red' : 'black' }}>
                        总所需里程数: {totalPoints}
                    </Typography>
                )}

                {/* 显示比例 */}
                {ratios && (
                    <Box sx={{ mt: 4 }}>
                        <Typography variant="h6">各舱位里程比例:</Typography>
                        <Typography>经济舱比例: {ratios.economyRatio}</Typography>
                        <Typography>特选经济舱比例: {ratios.premiumEconomyRatio}</Typography>
                        <Typography>商务舱比例: {ratios.businessRatio}</Typography>
                        <Typography>头等舱比例: {ratios.firstClassRatio}</Typography>
                    </Box>
                )}
            </Box>

            {/* 计算按钮 */}
            <Button variant="contained" sx={{ mt: 3 }} onClick={calculateDistance}>
                计算
            </Button>

            {/* 错误提示 */}
            {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                    请确认所有航班信息和舱位选择都填写完整！
                </Alert>
            )}
        </Box>
    );
};

export default CathayMixedCabinCalculator;
