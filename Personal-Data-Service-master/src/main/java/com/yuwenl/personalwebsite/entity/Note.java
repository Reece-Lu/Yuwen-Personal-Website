package com.yuwenl.personalwebsite.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "notes")
public class Note {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer noteid;

    private String notename;
    private String noteurl;
    private String notecovername;
}
