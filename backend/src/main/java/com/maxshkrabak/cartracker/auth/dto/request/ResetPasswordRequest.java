package com.maxshkrabak.cartracker.auth.dto.request;

public record ResetPasswordRequest (
     String email,
     String token,
     String newPassword
) {
}
