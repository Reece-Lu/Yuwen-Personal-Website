package com.yuwenl.personalwebsite.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.yuwenl.personalwebsite.entity.ExchangeRate;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface ExchangeRateRepository extends JpaRepository<ExchangeRate, Long> {
    // Find exchange rates for a specific currency pair
    List<ExchangeRate> findByBaseCurrencyAndTargetCurrency(String baseCurrency, String targetCurrency);

    // Find the most recent exchange rate record
    Optional<ExchangeRate> findTopByOrderByTimestampDesc();

    // Find exchange rates within a specific date range
    List<ExchangeRate> findByTimestampBetween(LocalDateTime start, LocalDateTime end);

}

