package com.yuwenl.personalwebsite.entity;

import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.*;

@Data
@NoArgsConstructor
@Entity
@Table(name = "exchange_rate")
public class ExchangeRate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 3)
    private String baseCurrency;

    @Column(nullable = false, length = 3)
    private String targetCurrency;

    @Column(nullable = false)
    private double buyRate;

    @Column(nullable = false)
    private double sellRate;

    @ManyToOne
    @JoinColumn(name = "source_id", nullable = false)
    private Source source;

    @Column(nullable = false, updatable = false, insertable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private java.sql.Timestamp timestamp;
}
