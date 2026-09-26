package com.maxshkrabak.cartracker.model.dto;

public record VehicleDTO(
        Long vid,
        String vin,
        String make,
        String model,
        int modelYear,
        String bodyClass,
        String trim,
        String color,
        String transmissionStyle,
        int engineCylinders,
        int engineHP,
        int mileage,
        String licensePlate) {
}
