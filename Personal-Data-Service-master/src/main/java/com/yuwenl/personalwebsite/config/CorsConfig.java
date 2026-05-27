package com.yuwenl.personalwebsite.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
public class CorsConfig {

    // The maximum validity time of the current cross-domain request. The default here is 1 day.
    private static final long MAX_AGE = 24 * 60 * 60;

    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration corsConfiguration = new CorsConfiguration();
        corsConfiguration.addAllowedOrigin("*"); // 1 Set the access source address
        corsConfiguration.addAllowedHeader("*"); // 2 Set up the access source request header
        corsConfiguration.addAllowedMethod("*"); // 3 Set the access source request method
        corsConfiguration.setMaxAge(MAX_AGE);
        source.registerCorsConfiguration("/**", corsConfiguration); // 4 Configure cross-domain settings for the interface
        return new CorsFilter(source);
    }
}
