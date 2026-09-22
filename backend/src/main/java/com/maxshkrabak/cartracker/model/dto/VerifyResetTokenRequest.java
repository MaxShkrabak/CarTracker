package com.maxshkrabak.cartracker.model.dto;

public record VerifyResetTokenRequest (
        String email,
        String token
){
}
