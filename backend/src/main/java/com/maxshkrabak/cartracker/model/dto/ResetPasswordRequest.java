package com.maxshkrabak.cartracker.model.dto;

public record ResetPasswordRequest (
     String email,
     String token,
     String newPassword
) {
}
