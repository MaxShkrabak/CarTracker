package com.maxshkrabak.cartracker.auth.dto.request;

// for updating signed-in users password
public record PasswordChangeRequest(
                String password,
                String newPassword
) {
}
