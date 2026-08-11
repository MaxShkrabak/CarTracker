package com.maxshkrabak.cartracker.vehicle.dto;

public record VehicleRequest(
                String vin,
                String licensePlate,
                String make,
                int year,
                String color,
                int mileage) {
}
