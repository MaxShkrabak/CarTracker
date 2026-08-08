package com.maxshkrabak.cartracker.auth.dto.request;

public record PasswordChangeRequest (
        String password,
        String newPassword
) {
}
