package com.maxshkrabak.cartracker.model.dto;

public record VehicleUpdateRequest(
        String vin,
        String licensePlate,
        String make,
        String model,
        Integer modelYear,
        String bodyClass,
        String trim,
        String color,
        String transmissionStyle,
        Integer engineCylinders,
        Integer engineHP,
        Integer mileage) {
}
