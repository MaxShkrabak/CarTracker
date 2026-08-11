package com.maxshkrabak.cartracker.auth.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@NoArgsConstructor
@Getter
@Setter
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // auto assign an id
    private Long uid;
    private String username;
    private String password;
    private String firstName;
    private String lastName;
    private boolean activated;
}
