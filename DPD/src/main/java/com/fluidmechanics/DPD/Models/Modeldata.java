package com.fluidmechanics.DPD.Models;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Data
public class Modeldata {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String type;

    @Column(length = 1000)
    private String description;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @OneToOne
    @JoinColumn(name = "current_version_id")
    @JsonManagedReference
    private Modeldataversion currentVersion;

    @OneToMany(mappedBy = "modeldata", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<Modeldataversion> versions;

    @ManyToOne
    @JsonBackReference
    Appuser appuser;

    // will do better security later
    // @Transient
    private String appUsername;

    @Enumerated(EnumType.STRING)
    private Status status;

}