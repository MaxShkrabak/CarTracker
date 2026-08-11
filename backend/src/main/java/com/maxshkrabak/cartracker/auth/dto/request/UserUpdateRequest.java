package com.maxshkrabak.cartracker.auth.dto.request;

public record UserUpdateRequest(
                String username,
                String firstName,
                String lastName) {
}
