package com.maxshkrabak.cartracker.vehicle.dto;

public record VehicleDTO(
                Long vid,
                String vin,
                String licensePlate,
                String make,
                int year,
                String color,
                int mileage) {

}
