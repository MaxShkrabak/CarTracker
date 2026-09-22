package com.maxshkrabak.cartracker.exception;

public class InvalidPasswordException extends RuntimeException {

    public InvalidPasswordException(String reason) {
        super(reason);
    }
}
