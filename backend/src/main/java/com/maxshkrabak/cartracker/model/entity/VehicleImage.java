package com.maxshkrabak.cartracker.model.entity;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "vehicle_images")
public class VehicleImage {
    @Id
    private Long vid;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @MapsId
    @JoinColumn(name = "vid")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Vehicle vehicle;

    private String contentType;

    @Column(nullable = false)
    private byte[] data;
}
