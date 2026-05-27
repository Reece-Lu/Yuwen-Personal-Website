package com.yuwenl.personalwebsite.service;

import com.yuwenl.personalwebsite.entity.ExchangeRate;
import com.yuwenl.personalwebsite.entity.Source;
import com.yuwenl.personalwebsite.repository.ExchangeRateRepository;
import com.yuwenl.personalwebsite.repository.SourceRepository;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Optional;

@Service
public class CurrencyScrapingService {

    @Autowired
    private ExchangeRateRepository exchangeRateRepository;

    @Autowired
    private SourceRepository sourceRepository;

    // 抓取并保存加元汇率数据的方法
    public void fetchAndSaveCADRates() {
        String url = "https://www.boc.cn/sourcedb/whpj/";

        try {
            // 获取网页内容
            Document doc = Jsoup.connect(url).get();
            Elements rows = doc.select("table tr");

            // 遍历表格行
            for (Element row : rows) {
                Elements cols = row.select("td");
                if (cols.size() > 0 && "加拿大元".equals(cols.get(0).text())) {
                    // 提取现汇买入价和现汇卖出价，并除以100
                    double buyRate = Double.parseDouble(cols.get(1).text()) / 100.0;  // 现汇买入价（加元兑换人民币）
                    double sellRate = Double.parseDouble(cols.get(3).text()) / 100.0; // 现汇卖出价（人民币兑换加元）

                    // 获取 Source 信息
                    Optional<Source> sourceOpt = sourceRepository.findById(1L); // Bank of China Source id = 1
                    if (sourceOpt.isPresent()) {
                        Source source = sourceOpt.get();

                        // 创建并保存ExchangeRate实体
                        ExchangeRate rate = new ExchangeRate();
                        rate.setBaseCurrency("CNY");
                        rate.setTargetCurrency("CAD");
                        rate.setBuyRate(buyRate);
                        rate.setSellRate(sellRate);
                        rate.setSource(source);

                        // 保存到数据库
                        exchangeRateRepository.save(rate);
                    }
                    break;  // 找到加拿大元后跳出循环
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    // 抓取并保存美元汇率数据的方法
    public void fetchAndSaveUSDRates() {
        String url = "https://www.boc.cn/sourcedb/whpj/";

        try {
            // 获取网页内容
            Document doc = Jsoup.connect(url).get();
            Elements rows = doc.select("table tr");

            // 遍历表格行
            for (Element row : rows) {
                Elements cols = row.select("td");
                if (cols.size() > 0 && "美元".equals(cols.get(0).text())) {
                    // 提取现汇买入价和现汇卖出价，并除以100
                    double buyRate = Double.parseDouble(cols.get(1).text()) / 100.0;  // 现汇买入价（美元兑换人民币）
                    double sellRate = Double.parseDouble(cols.get(3).text()) / 100.0; // 现汇卖出价（人民币兑换美元）

                    // 获取 Source 信息
                    Optional<Source> sourceOpt = sourceRepository.findById(1L); // Bank of China Source id = 1
                    if (sourceOpt.isPresent()) {
                        Source source = sourceOpt.get();

                        // 创建并保存ExchangeRate实体
                        ExchangeRate rate = new ExchangeRate();
                        rate.setBaseCurrency("CNY");
                        rate.setTargetCurrency("USD");
                        rate.setBuyRate(buyRate);
                        rate.setSellRate(sellRate);
                        rate.setSource(source);

                        // 保存到数据库
                        exchangeRateRepository.save(rate);
                    }
                    break;  // 找到美元后跳出循环
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
