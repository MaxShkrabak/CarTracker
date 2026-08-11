package com.maxshkrabak.cartracker.vehicle.service;

import com.maxshkrabak.cartracker.auth.repository.UserRepository;
import com.maxshkrabak.cartracker.vehicle.dto.VehicleDTO;
import com.maxshkrabak.cartracker.vehicle.dto.VehicleRequest;
import com.maxshkrabak.cartracker.vehicle.dto.VehicleUpdateRequest;
import com.maxshkrabak.cartracker.vehicle.entity.Vehicle;
import com.maxshkrabak.cartracker.vehicle.exception.VehicleNotFoundException;
import com.maxshkrabak.cartracker.vehicle.mapping.VehicleMapper;
import com.maxshkrabak.cartracker.vehicle.repository.VehicleRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class VehicleService {

    private final VehicleRepository vehicleRepo;
    private final UserRepository userRepo;
    private final VehicleMapper vehicleMapper;

    // fetch all vehicles owned by user
    public List<VehicleDTO> getVehicles(Long uid) {
        List<Vehicle> vehicles = vehicleRepo.findByUserUid(uid);
        List<VehicleDTO> vehiclesDTOs = new ArrayList<>();

        for (Vehicle vehicle : vehicles) {
            vehiclesDTOs.add(vehicleMapper.toDto(vehicle));
        }

        return vehiclesDTOs;
    }

    public VehicleDTO addVehicle(VehicleRequest vehicleRequest, Long uid) {
        Vehicle vehicle = vehicleMapper.toEntity(vehicleRequest);
        vehicle.setUser(userRepo.getReferenceById(uid));
        return vehicleMapper.toDto(vehicleRepo.save(vehicle));
    }

    // fetches one specific vehicle
    public VehicleDTO getVehicle(Long vid, Long uid) {
        Vehicle vehicle = vehicleRepo.findByVidAndUserUid(vid, uid).orElseThrow(VehicleNotFoundException::new);
        return vehicleMapper.toDto(vehicle);
    }

    public void deleteVehicle(Long vid, Long uid) {
        Vehicle vehicle = vehicleRepo.findByVidAndUserUid(vid, uid).orElseThrow(VehicleNotFoundException::new);
        vehicleRepo.delete(vehicle);
    }

    @Transactional
    public VehicleDTO updateVehicle(Long vid, Long uid, VehicleUpdateRequest request) {
        Vehicle vehicle = vehicleRepo.findByVidAndUserUid(vid, uid).orElseThrow(VehicleNotFoundException::new);

        vehicleMapper.updateVehicleFromRequest(request, vehicle);
        return vehicleMapper.toDto(vehicle);
    }
}
