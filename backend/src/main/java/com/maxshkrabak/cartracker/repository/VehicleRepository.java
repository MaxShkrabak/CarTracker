package com.maxshkrabak.cartracker.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.maxshkrabak.cartracker.model.entity.Vehicle;

import java.util.List;
import java.util.Optional;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
    List<Vehicle> findByUserUid(Long uid);

    Optional<Vehicle> findByVidAndUserUid(Long vid, Long uid);

    Optional<Vehicle> findByVinAndUserUid(String vin, Long uid);
}
