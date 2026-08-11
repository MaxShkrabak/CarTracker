package com.maxshkrabak.cartracker.vehicle.exception;

public class VpicUnavailableException extends RuntimeException {
    public VpicUnavailableException() {
        super("Vin decoding service is not available.");
    }
}
