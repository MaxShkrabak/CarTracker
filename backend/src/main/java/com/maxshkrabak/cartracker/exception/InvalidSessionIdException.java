package com.maxshkrabak.cartracker.exception;

public class InvalidSessionIdException extends RuntimeException {
    public InvalidSessionIdException() {
        super("Session ID is invalid.");
    }
    
}
