package com.maxshkrabak.cartracker.exception;

public class VpicUnavailableException extends RuntimeException {
    public VpicUnavailableException() {
        super("Vin decoding service is not available.");
    }
}
