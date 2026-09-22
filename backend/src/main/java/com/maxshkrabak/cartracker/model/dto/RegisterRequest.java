package com.maxshkrabak.cartracker.model.dto;

public record RegisterRequest(
        String username,
        String firstName,
        String lastName,
        String password) {
}
