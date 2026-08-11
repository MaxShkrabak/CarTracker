package com.maxshkrabak.cartracker.vehicle.dto;

public record VinDecodeResponse (
        String make,
        String bodyClass,
        int doors,
        int engineCylinders,
        int engineHP,
        String model,
        int modelYear,
        String transmissionStyle,
        String trim,
        String vin
) {
}
