package com.maxshkrabak.cartracker.model.entity;

import java.time.Instant;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "drive_sessions")
public class DriveSession {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long sessionId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "vid")
    private Vehicle vehicle;

    private Instant startedAt;
    private Instant endedAt;

    private Double distanceKm;

    private Integer maxRPM;
    private Integer maxKPH;
    private Double avgRPM;
    private Double avgKPH;

    private Integer maxCoolantTempC;

    private Integer sampleCount;
}
