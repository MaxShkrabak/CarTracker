package com.maxshkrabak.cartracker.model.dto;

public record VehicleUpdateRequest(
    String vin,
    String licensePlate,
    String make,
    Integer modelYear,
    String color,
    Integer mileage) {
}
