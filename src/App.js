import React from 'react';
import NavigationBar from './components/NavigationBar';
import Footer from './components/Footer';
import ProjectAPIs from './pages/ProjectAPIsPage/ProjectAPIs';
import Home from './pages/Home';
import LaptopPricePrediction from './pages/LaptopPricePrediction';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CathayMixedCabinCalculator from "./pages/CathayMixedCabinCalculator";
import ExchangeRateDisplay from "./pages/ExchangeRateDisplay";
import WebsiteInfo from "./pages/WebsiteInfo";

function App() {
    return (
        <BrowserRouter>
            <NavigationBar />
            <Routes>
                <Route path="/projectapis" element={<ProjectAPIs />} />
                <Route path="/" element={<Home />} />
                <Route path="/cathaypacific" element={<CathayMixedCabinCalculator/>} />
                <Route path="/exchangerate" element={<ExchangeRateDisplay />} />
                <Route path="/websiteinfo" element={<WebsiteInfo/>} />
                <Route path='/laptoppriceprediction' element={<LaptopPricePrediction />} />
            </Routes>
            <Footer />
        </BrowserRouter>
    );
}

export default App;
