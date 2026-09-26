package com.maxshkrabak.cartracker.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.maxshkrabak.cartracker.model.entity.DriveSample;

@Repository
public interface DriveSampleRepository extends JpaRepository<DriveSample, Long> {

    @Query("select s from DriveSample s where s.driveSession.sessionId = :sessionId order by s.recordedAt")
    List<DriveSample> findSessionSamples(@Param("sessionId") Long sessionId);
}
