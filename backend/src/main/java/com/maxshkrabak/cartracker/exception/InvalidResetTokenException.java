package com.maxshkrabak.cartracker.exception;

public class InvalidResetTokenException extends RuntimeException {
    public InvalidResetTokenException() {
        super("Token is invalid.");
    }
}
