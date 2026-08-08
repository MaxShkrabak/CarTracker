package com.maxshkrabak.cartracker.auth.exception;

public class InvalidPasswordException extends RuntimeException {

    public InvalidPasswordException(String reason) {
        super(reason);
    }
}
