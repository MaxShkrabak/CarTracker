package com.maxshkrabak.cartracker.exception;

public class VehicleNotFoundException extends RuntimeException {
    public VehicleNotFoundException() {
        super("Vehicle doesn't exist.");
    }
}
