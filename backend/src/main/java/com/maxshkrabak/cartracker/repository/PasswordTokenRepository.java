package com.maxshkrabak.cartracker.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.maxshkrabak.cartracker.model.entity.PasswordResetToken;
import com.maxshkrabak.cartracker.model.entity.User;

import java.time.Instant;
import java.util.Optional;

@Repository
public interface PasswordTokenRepository extends JpaRepository<PasswordResetToken, Long> {
    @Modifying
    @Query("UPDATE PasswordResetToken t SET t.usedAt = :now " +
           "WHERE t.user = :user AND t.usedAt IS NULL AND t.expiresAt > :now")
    void markAllUsedForUser(@Param("user") User user, @Param("now") Instant now);

    Optional<PasswordResetToken> findByUserAndTokenHash(User user, String tokenHash);
}
