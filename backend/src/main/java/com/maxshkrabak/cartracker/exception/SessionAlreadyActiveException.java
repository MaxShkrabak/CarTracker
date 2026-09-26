package com.maxshkrabak.cartracker.exception;

public class SessionAlreadyActiveException extends RuntimeException {
    public SessionAlreadyActiveException() {
        super("Session is currently active.");
    }
}
