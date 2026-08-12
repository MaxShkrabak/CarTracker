package com.maxshkrabak.cartracker.vehicle.entity;

import com.maxshkrabak.cartracker.auth.entity.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@NoArgsConstructor
@Setter
@Getter
@Table(name = "vehicles")
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long vid;

    private String vin;
    private String make;
    private String model;
    private int modelYear;
    private String bodyClass;
    private String trim;
    private String color;
    private String transmissionStyle;
    private int engineCylinders;
    private int engineHP;
    private int doors;
    private int mileage;
    private String licensePlate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "uid")
    private User user;
}
