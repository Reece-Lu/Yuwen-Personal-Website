import React, { useState } from 'react';
import { Box, Grid, Typography, Alert, Container } from '@mui/material';
import flightsData from '../data/cx_flights_with_distances.json';
import FlightSelector from "../components/FlightSelector";
import mileageChart from '../data/mileage_chart.json';
import routes from '../data/routes.min.js';
import CustomButton from '../components/CustomButton';
import FlightResultForm from '../components/FlightResultForm'; // 导入结果表单组件

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
    const [ratios, setRatios] = useState({});
    const [reset, setReset] = useState(false);
    const [showResultForm, setShowResultForm] = useState(false); // 用于控制是否显示结果表单

    const handleSelectionChange = (selections) => {
        setFlightSelections(selections);
    };

    // 计算总里程数的函数
    const calculateTotalPointsNeeded = (firstLegDistance, secondLegDistance) => {
        const totalMiles = (firstLegDistance || 0) + (secondLegDistance || 0);

        if (totalMiles === 0) {
            return '无法计算总里程数';
        }
        const category = mileageChart.find(item => totalMiles <= item.range);

        if (!category) {
            return '无法找到适合的航程类别';
        }

        const economyRatio = category.economy / totalMiles;
        const premiumEconomyRatio = category.premium_economy / totalMiles;
        const businessRatio = category.business / totalMiles;
        const firstClassRatio = category.first_class ? category.first_class / totalMiles : null;

        setRatios({
            economyRatio: economyRatio.toFixed(2),
            premiumEconomyRatio: premiumEconomyRatio.toFixed(2),
            businessRatio: businessRatio.toFixed(2),
            firstClassRatio: firstClassRatio ? firstClassRatio.toFixed(2) : 'N/A',
        });

        const cabinRatios = {
            '经济': economyRatio,
            '超经': premiumEconomyRatio,
            '商务': businessRatio,
            '头等': firstClassRatio
        };

        const firstLegCabin = flightSelections.firstLegCabin?.value;
        const secondLegCabin = flightSelections.secondLegCabin?.value;

        const firstLegPoints = cabinRatios[firstLegCabin] ? firstLegDistance * cabinRatios[firstLegCabin] : 0;
        const secondLegPoints = cabinRatios[secondLegCabin] ? secondLegDistance * cabinRatios[secondLegCabin] : 0;

        const totalPointsNeeded = firstLegPoints + secondLegPoints;
        const roundedTotalPoints = Math.ceil(totalPointsNeeded / 100) * 100;

        return roundedTotalPoints.toFixed(0); // 返回整数形式的里程数
    };

    const calculateDistance = () => {
        if (!flightSelections.firstLegDeparture || !flightSelections.firstLegArrival ||
            !flightSelections.firstLegCabin || !flightSelections.secondLegDeparture ||
            !flightSelections.secondLegArrival || !flightSelections.secondLegCabin) {
            setError(true);
            setShowResultForm(false); // 不显示结果
            return;
        }

        setError(false);

        const getDistance = (departure, arrival) => {
            const departureRoutes = routes[departure];
            if (!departureRoutes) return 0;
            const flightRoute = departureRoutes.find(route => route.destination === arrival);
            return flightRoute ? flightRoute.miles : 0;
        };

        const firstLegDistance = getDistance(flightSelections.firstLegDeparture.value, flightSelections.firstLegArrival.value);
        setFirstLegDistance(firstLegDistance);

        const secondLegDistance = getDistance(flightSelections.secondLegDeparture.value, flightSelections.secondLegArrival.value);
        setSecondLegDistance(secondLegDistance);

        setFlightList1(flightsData.filter(
            (flight) => flight.departure_airport === flightSelections.firstLegDeparture.value &&
                flight.arrival_airport === flightSelections.firstLegArrival.value
        ));
        setFlightList2(flightsData.filter(
            (flight) => flight.departure_airport === flightSelections.secondLegDeparture.value &&
                flight.arrival_airport === flightSelections.secondLegArrival.value
        ));

        if (firstLegDistance > 0 && secondLegDistance > 0) {
            const points = calculateTotalPointsNeeded(firstLegDistance, secondLegDistance);
            setTotalPoints(points);
            setShowResultForm(true); // 点击计算后，显示结果表单
        } else {
            setTotalPoints('无法计算所需里程数');
            setShowResultForm(false); // 不显示结果
        }
    };

    const resetCalculation = () => {
        setReset(true); // 触发 FlightSelector 组件的重置
        setFlightSelections({
            firstLegDeparture: null,
            firstLegArrival: null,
            firstLegCabin: null,
            secondLegDeparture: null,
            secondLegArrival: null,
            secondLegCabin: null,
        });
        setFirstLegDistance(null);
        setSecondLegDistance(null);
        setFlightList1([]);
        setFlightList2([]);
        setTotalPoints(null);
        setRatios({});
        setError(false);
        setShowResultForm(false); // 重置时隐藏结果表单

        // 重置信号传递完后，将 reset 置为 false
        setTimeout(() => setReset(false), 0);
    };

    return (
        <Container maxWidth="lg">
            <Box sx={{ p: 3 }}>
                <Typography variant="h4" gutterBottom>国泰航空混舱计算器</Typography>

                <FlightSelector
                    flightsData={flightsData}
                    onSelectionChange={handleSelectionChange}
                    reset={reset} // 传递 reset 属性
                />

                <Grid container spacing={2} justifyContent="center">
                    <Grid item xs={12} md={6}>
                        <CustomButton
                            text="计算"
                            onClick={calculateDistance}
                            variant="contained"
                            color="#005D63"
                            height={45}
                            hoverColor="#004a4f"
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <CustomButton
                            text="重新计算"
                            onClick={resetCalculation}
                            variant="outlined"
                            color="#005D63"
                            height={45}
                            hoverColor="#004a4f"
                        />
                    </Grid>

                    {error && (
                        <Grid item xs={12}>
                            <Alert severity="error" sx={{ mt: 2 }}>
                                请确认所有航班信息和舱位选择都填写完整！
                            </Alert>
                        </Grid>
                    )}
                </Grid>

                {showResultForm && (
                    <Grid container spacing={2} sx={{ mt: 4 }}  justifyContent="center">
                        <FlightResultForm
                            firstLegDeparture={flightSelections.firstLegDeparture?.label}
                            firstLegArrival={flightSelections.firstLegArrival?.label}
                            secondLegDeparture={flightSelections.secondLegDeparture?.label}
                            secondLegArrival={flightSelections.secondLegArrival?.label}
                            totalPoints={totalPoints}
                            firstLegDistance={firstLegDistance}
                            secondLegDistance={secondLegDistance}
                            flightList1={flightList1}
                            flightList2={flightList2}
                        />
                    </Grid>
                )}
            </Box>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1, textAlign: 'center' }}>
                所有信息仅供参考，实际航班情况和票价以航空公司电话客服为准。
            </Typography>

        </Container>
    );
};

export default CathayMixedCabinCalculator;
