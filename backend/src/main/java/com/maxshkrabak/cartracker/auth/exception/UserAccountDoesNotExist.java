package com.maxshkrabak.cartracker.auth.exception;

public class UserAccountDoesNotExist extends RuntimeException {
    public UserAccountDoesNotExist(Long id) {
        super("Account does not exist" + id);
    }
}
