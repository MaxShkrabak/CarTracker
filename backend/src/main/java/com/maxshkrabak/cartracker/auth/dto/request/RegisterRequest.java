package com.maxshkrabak.cartracker.auth.dto.request;

public record RegisterRequest (
    String username,
    String firstName,
    String lastName,
    String password
){
}
