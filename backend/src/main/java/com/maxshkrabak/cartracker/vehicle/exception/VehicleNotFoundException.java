package com.maxshkrabak.cartracker.vehicle.exception;

public class VehicleNotFoundException extends RuntimeException {
    public VehicleNotFoundException() {
        super("Vehicle doesn't exist.");
    }
}
