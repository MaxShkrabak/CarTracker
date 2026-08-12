package com.maxshkrabak.cartracker.vehicle.dto;

public record VehicleUpdateRequest(
          String vin,
          String licensePlate,
          String make,
          Integer year,
          String color,
          Integer mileage
        ) {
}
