package com.maxshkrabak.cartracker.auth.dto.request;

public record ResetPasswordRequest (
     String token,
     String newPassword
) {
}
