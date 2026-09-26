package com.maxshkrabak.cartracker.model.dto;

public record VinDecodeResponse(
                String make,
                String bodyClass,
                int engineCylinders,
                int engineHP,
                String model,
                int modelYear,
                String transmissionStyle,
                String trim,
                String vin) {
}
