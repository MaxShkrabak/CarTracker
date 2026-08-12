package com.maxshkrabak.cartracker.vehicle.controller;

import com.maxshkrabak.cartracker.auth.security.CustomUserDetails;
import com.maxshkrabak.cartracker.vehicle.dto.VehicleDTO;
import com.maxshkrabak.cartracker.vehicle.dto.VehicleRequest;
import com.maxshkrabak.cartracker.vehicle.dto.VehicleUpdateRequest;
import com.maxshkrabak.cartracker.vehicle.dto.VinDecodeResponse;
import com.maxshkrabak.cartracker.vehicle.service.VehicleService;
import com.maxshkrabak.cartracker.vehicle.service.VinDecodeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/vehicle")
public class VehicleController {

    private final VehicleService service;
    private final VinDecodeService vinService;

    @GetMapping()
    public List<VehicleDTO> getVehicles(@AuthenticationPrincipal CustomUserDetails principal) {
        return service.getVehicles(principal.getUid());
    }

    @PostMapping("/add")
    public ResponseEntity<VehicleDTO> addVehicle(@RequestBody VehicleRequest vehicleRequest,
            @AuthenticationPrincipal CustomUserDetails principal) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.addVehicle(vehicleRequest, principal.getUid()));
    }

    @GetMapping("/{vid}")
    public ResponseEntity<VehicleDTO> getVehicle(@PathVariable Long vid,
            @AuthenticationPrincipal CustomUserDetails principal) {
        return ResponseEntity.status(HttpStatus.OK).body(service.getVehicle(vid, principal.getUid()));
    }

    @DeleteMapping("/{vid}")
    public ResponseEntity<Void> deleteVehicle(@PathVariable Long vid,
            @AuthenticationPrincipal CustomUserDetails principal) {
        service.deleteVehicle(vid, principal.getUid());
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @PatchMapping("/{vid}")
    public ResponseEntity<VehicleDTO> updateVehicle(@PathVariable Long vid, @RequestBody VehicleUpdateRequest request,
            @AuthenticationPrincipal CustomUserDetails principal) {
        return ResponseEntity.status(HttpStatus.OK).body(service.updateVehicle(vid, principal.getUid(), request));
    }

    @GetMapping("/decode/{vin}")
    public ResponseEntity<VinDecodeResponse> decodeAndFindByVin(@PathVariable String vin) {
        return ResponseEntity.status(HttpStatus.OK).body(vinService.decodeVin(vin));
    }

    @PatchMapping("/decode/{vin}")
    public ResponseEntity<VehicleDTO> decodeAndUpdateVehicle(@PathVariable String vin, @AuthenticationPrincipal CustomUserDetails principal) {
        return ResponseEntity.status(HttpStatus.OK).body(service.updateVehicleFromDecode(vin, principal.getUid()));
    }
}
