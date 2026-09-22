package com.maxshkrabak.cartracker.exception;

public class UserAccountDoesNotExist extends RuntimeException {
    public UserAccountDoesNotExist(Long id) {
        super("Account does not exist" + id);
    }
}
