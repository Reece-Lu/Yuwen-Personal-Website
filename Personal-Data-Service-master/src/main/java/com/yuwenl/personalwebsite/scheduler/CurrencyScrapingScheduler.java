package com.yuwenl.personalwebsite.scheduler;

import com.yuwenl.personalwebsite.service.CurrencyScrapingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class CurrencyScrapingScheduler {

    @Autowired
    private CurrencyScrapingService currencyScrapingService;

    @Scheduled(cron = "0 0 */4 * * ?")
    public void scheduleCurrencyRateFetching() {
        currencyScrapingService.fetchAndSaveCADRates();
        currencyScrapingService.fetchAndSaveUSDRates();
    }
}
