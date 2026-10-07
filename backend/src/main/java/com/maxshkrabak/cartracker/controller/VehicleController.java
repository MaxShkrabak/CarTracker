package com.maxshkrabak.cartracker.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.maxshkrabak.cartracker.model.dto.UserDTO;
import com.maxshkrabak.cartracker.model.dto.VehicleDTO;
import com.maxshkrabak.cartracker.model.dto.VehicleRequest;
import com.maxshkrabak.cartracker.model.dto.VehicleUpdateRequest;
import com.maxshkrabak.cartracker.model.dto.VinDecodeResponse;
import com.maxshkrabak.cartracker.security.CustomUserDetails;
import com.maxshkrabak.cartracker.service.VehicleService;
import com.maxshkrabak.cartracker.service.VinDecodeService;

import lombok.RequiredArgsConstructor;

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

    @PutMapping("/{vid}/primary")
    public ResponseEntity<UserDTO> setPrimary(@PathVariable Long vid, @AuthenticationPrincipal CustomUserDetails principal) {
        return ResponseEntity.ok(service.setPrimary(vid, principal.getUid()));
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
