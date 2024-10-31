import React, { useEffect, useState, useMemo } from 'react';
import { get } from '../utils/api-utils';
import ExchangeRateChart from "../components/ExchangeRateChart";

const ExchangeRateDisplay = () => {
    const [cnyCadRates, setCnyCadRates] = useState([]);
    const [cnyUsdRates, setCnyUsdRates] = useState([]);

    useEffect(() => {
        const fetchCnyCadRates = async () => {
            try {
                const cnyCadData = await get('/exchange-rates/CNY-CAD');
                setCnyCadRates(
                    cnyCadData.map(item => ({
                        timestamp: new Date(item.timestamp), // 转换为 Date 对象
                        buyRate: parseFloat(item.buyRate),    // 转换为数字
                        sellRate: parseFloat(item.sellRate),  // 转换为数字
                    }))
                );
                console.log("CNY-CAD exchange rates:", cnyCadData);
            } catch (error) {
                console.error("Error fetching CNY-CAD exchange rates:", error);
            }
        };

        const fetchCnyUsdRates = async () => {
            try {
                const cnyUsdData = await get('/exchange-rates/CNY-USD');
                setCnyUsdRates(
                    cnyUsdData.map(item => ({
                        timestamp: new Date(item.timestamp),
                        buyRate: parseFloat(item.buyRate),
                        sellRate: parseFloat(item.sellRate),
                    }))
                );
                console.log("CNY-USD exchange rates:", cnyUsdData);
            } catch (error) {
                console.error("Error fetching CNY-USD exchange rates:", error);
            }
        };

        fetchCnyCadRates();
        fetchCnyUsdRates();
    }, []);

    return (
        <div>
            <h1>Exchange Rate Data</h1>
            <ExchangeRateChart data={cnyCadRates} title="CNY to CAD Exchange Rates" width={800} />
            <ExchangeRateChart data={cnyUsdRates} title="CNY to USD Exchange Rates" width={800} />
        </div>
    );
};

export default ExchangeRateDisplay;
