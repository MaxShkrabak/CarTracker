package com.maxshkrabak.cartracker.exception;

public class VinDecodeException extends RuntimeException {
    public VinDecodeException() {
        super("Could not decode the provided vin.");
    }
}
