package com.maxshkrabak.cartracker.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.maxshkrabak.cartracker.exception.UserAccountDoesNotExist;
import com.maxshkrabak.cartracker.exception.VehicleNotFoundException;
import com.maxshkrabak.cartracker.mapper.UserMapper;
import com.maxshkrabak.cartracker.mapper.VehicleMapper;
import com.maxshkrabak.cartracker.model.dto.UserDTO;
import com.maxshkrabak.cartracker.model.dto.VehicleDTO;
import com.maxshkrabak.cartracker.model.dto.VehicleRequest;
import com.maxshkrabak.cartracker.model.dto.VehicleUpdateRequest;
import com.maxshkrabak.cartracker.model.dto.VinDecodeResponse;
import com.maxshkrabak.cartracker.model.entity.User;
import com.maxshkrabak.cartracker.model.entity.Vehicle;
import com.maxshkrabak.cartracker.repository.UserRepository;
import com.maxshkrabak.cartracker.repository.VehicleRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class VehicleService {

    private final VehicleRepository vehicleRepo;
    private final UserRepository userRepo;
    private final VehicleMapper vehicleMapper;
    private final UserMapper userMapper;
    private final VinDecodeService vinDecodeService;

    // fetch all vehicles owned by user
    public List<VehicleDTO> getVehicles(Long uid) {
        return vehicleMapper.toDtoList(vehicleRepo.findByUserUid(uid));
    }

    @Transactional
    public VehicleDTO addVehicle(VehicleRequest vehicleRequest, Long uid) {
        User user = userRepo.findById(uid).orElseThrow(() -> new UserAccountDoesNotExist(uid));

        Vehicle vehicle = vehicleMapper.toEntity(vehicleRequest);
        vehicle.setUser(user);
        Vehicle saved = vehicleRepo.save(vehicle);

        if (user.getPrimaryVehicle() == null) {
            user.setPrimaryVehicle(saved);
        }
        
        return vehicleMapper.toDto(saved);
    }

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

    @Transactional
    public VehicleDTO updateVehicleFromDecode(String vin, Long uid) {
        VinDecodeResponse decodedVehicle = vinDecodeService.decodeVin(vin);
        Vehicle vehicle = vehicleRepo.findByVinAndUserUid(vin, uid).orElseThrow(VehicleNotFoundException::new);

        // TOOD: Will need to add an option for adding as brand new vehicle
        // only works for updating existing car by VIN
        vehicleMapper.updateFromDecode(decodedVehicle, vehicle);
        return vehicleMapper.toDto(vehicle);
    }

    @Transactional
    public UserDTO setPrimary(Long vid, Long uid) {
        Vehicle vehicle = vehicleRepo.findByVidAndUserUid(vid, uid).orElseThrow(VehicleNotFoundException::new);
        User user = vehicle.getUser();
        user.setPrimaryVehicle(vehicle);

        return userMapper.toDto(user);
    }
}
