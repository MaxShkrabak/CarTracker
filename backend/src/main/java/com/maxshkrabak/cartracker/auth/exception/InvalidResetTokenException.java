package com.maxshkrabak.cartracker.auth.exception;

public class InvalidResetTokenException extends RuntimeException {
    public InvalidResetTokenException() {
        super("Token is invalid.");
    }
}
