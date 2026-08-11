package com.maxshkrabak.cartracker.vehicle.exception;

public class VinDecodeException extends RuntimeException {
    public VinDecodeException() {
        super("Could not decode the provided vin.");
    }
}
