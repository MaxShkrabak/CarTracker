package com.maxshkrabak.cartracker.auth.repository;

import com.maxshkrabak.cartracker.auth.entity.PasswordResetToken;
import com.maxshkrabak.cartracker.auth.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.Optional;

@Repository
public interface PasswordTokenRepository extends JpaRepository<PasswordResetToken, Long> {
    @Modifying
    @Query("UPDATE PasswordResetToken t SET t.usedAt = :now " +
           "WHERE t.user = :user AND t.usedAt IS NULL AND t.expiresAt > :now")
    void markAllUsedForUser(@Param("user") User user, @Param("now") Instant now);

    Optional<PasswordResetToken> findByTokenHash(String token);
}
