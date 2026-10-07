package com.maxshkrabak.cartracker.model.dto;

public record UserDTO(
                Long uid,
                String username,
                String firstName,
                String lastName,
                boolean activated,
                Long primaryVehicleId
            ) {
}
