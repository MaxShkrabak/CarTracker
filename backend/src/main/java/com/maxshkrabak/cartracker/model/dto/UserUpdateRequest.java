package com.maxshkrabak.cartracker.model.dto;

public record UserUpdateRequest(
                String username,
                String firstName,
                String lastName) {
}
