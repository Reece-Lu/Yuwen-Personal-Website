package com.yuwenl.personalwebsite.controller;

import com.yuwenl.personalwebsite.entity.ExchangeRate;
import com.yuwenl.personalwebsite.repository.ExchangeRateRepository;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/exchange-rates")
public class ExchangeRateController {

    @Autowired
    private ExchangeRateRepository exchangeRateRepository;

    // Get all exchange rate records
    @Operation(summary = "Get all exchange rates", description = "Retrieve a list of all exchange rate records in the database")
    @GetMapping
    public List<ExchangeRate> getAllExchangeRates() {
        return exchangeRateRepository.findAll();
    }

    // Get exchange rates for a specific currency pair (e.g., CNY to USD)
    @Operation(summary = "Get exchange rates for a specific currency pair", description = "Retrieve exchange rate data for a specific currency pair such as CNY to USD or CNY to CAD")
    @GetMapping("/{baseCurrency}-{targetCurrency}")
    public List<ExchangeRate> getExchangeRatesByCurrencyPair(
            @PathVariable String baseCurrency,
            @PathVariable String targetCurrency) {
        return exchangeRateRepository.findByBaseCurrencyAndTargetCurrency(baseCurrency, targetCurrency);
    }

    // Get the most recent exchange rate record
    @Operation(summary = "Get the most recent exchange rate", description = "Retrieve the most recent exchange rate data available in the database")
    @GetMapping("/recent")
    public Optional<ExchangeRate> getMostRecentExchangeRate() {
        return exchangeRateRepository.findTopByOrderByTimestampDesc();
    }

    // Get exchange rates within a specific date range
    @Operation(summary = "Get exchange rates within a specific date range", description = "Retrieve exchange rates between the provided start and end date")
    @GetMapping("/range")
    public List<ExchangeRate> getExchangeRatesByDateRange(
            @RequestParam("start") String startDate,
            @RequestParam("end") String endDate) {
        LocalDateTime start = LocalDateTime.parse(startDate);
        LocalDateTime end = LocalDateTime.parse(endDate);
        return exchangeRateRepository.findByTimestampBetween(start, end);
    }
}
