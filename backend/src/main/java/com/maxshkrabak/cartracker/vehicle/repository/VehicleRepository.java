package com.maxshkrabak.cartracker.vehicle.repository;

import com.maxshkrabak.cartracker.vehicle.entity.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
    List<Vehicle> findByUserUid(Long uid);

    Optional<Vehicle> findByVidAndUserUid(Long vid, Long uid);
}
