package com.maxshkrabak.cartracker.auth.dto;

public record UserDTO (
    Long uid,
    String username,
    String firstName,
    String lastName,
    boolean activated
) {

}
