package com.maxshkrabak.cartracker.model.dto;

// for updating signed-in users password
public record PasswordChangeRequest(
        String password,
        String newPassword) {
}
