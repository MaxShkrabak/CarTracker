package com.maxshkrabak.cartracker.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.maxshkrabak.cartracker.model.entity.DriveSession;

@Repository
public interface DriveSessionRepository extends JpaRepository<DriveSession, Long> {

    @Query("select s from DriveSession s join fetch s.vehicle v where s.sessionId = :sessionId and v.user.uid = :uid")
    Optional<DriveSession> findUsersDriveSession(@Param("sessionId") Long sessionId, @Param("uid") Long uid);

    @Query("select s from DriveSession s join fetch s.vehicle v where v.vid = :vid and v.user.uid = :uid order by s.startedAt desc")
    List<DriveSession> findUsersVehicleDriveSessions(@Param("vid") Long vid, @Param("uid") Long uid);

    Optional<DriveSession> findByVehicle_VidAndEndedAtIsNull(Long vid);
}
