package com.yuwenl.personalwebsite.entity;

import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.*;

@Data
@NoArgsConstructor
@Entity
@Table(name = "source")
public class Source {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column
    private String url;

    @Column
    private String description;
}
