package com.maxshkrabak.cartracker.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import org.springframework.web.bind.annotation.RestController;

import com.maxshkrabak.cartracker.model.dto.DriveSampleDTO;
import com.maxshkrabak.cartracker.model.dto.DriveSampleRequest;
import com.maxshkrabak.cartracker.model.dto.DriveSessionDTO;
import com.maxshkrabak.cartracker.model.dto.DriveSessionRequest;
import com.maxshkrabak.cartracker.security.CustomUserDetails;
import com.maxshkrabak.cartracker.service.DriveService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/drive")
public class DriveController {

    private final DriveService driveService;

    // ---- samples -----

    // save sample
    @PostMapping("/session/{sessionId}/samples")
    public ResponseEntity<Void> addSamples(@PathVariable Long sessionId, @RequestBody List<DriveSampleRequest> requests,
            @AuthenticationPrincipal CustomUserDetails principal) {
        driveService.addSamples(sessionId, principal.getUid(), requests);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    // get all samples
    @GetMapping("/session/{sessionId}/samples")
    public List<DriveSampleDTO> getSamples(@PathVariable Long sessionId,
            @AuthenticationPrincipal CustomUserDetails principal) {
        return driveService.getSamples(sessionId, principal.getUid());
    }

    // delete sample

    // ---- sessions ----

    // get vehicles sessions
    @GetMapping("/vehicle/{vid}/sessions")
    public List<DriveSessionDTO> getVehicleSessions(@PathVariable Long vid,
            @AuthenticationPrincipal CustomUserDetails principal) {
        return driveService.getVehicleSessions(vid, principal.getUid());
    }

    // save session
    @PostMapping("/vehicle/{vid}/session")
    public ResponseEntity<DriveSessionDTO> startSession(@PathVariable Long vid,
            @RequestBody DriveSessionRequest request, @AuthenticationPrincipal CustomUserDetails principal) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(driveService.startSession(vid, principal.getUid(), request));
    }

    // end session
    @PatchMapping("/session/{sessionId}/end")
    public ResponseEntity<DriveSessionDTO> endSession(@PathVariable Long sessionId,
            @RequestBody DriveSessionRequest request, @AuthenticationPrincipal CustomUserDetails principal) {
        return ResponseEntity.status(HttpStatus.OK)
                .body(driveService.endSession(sessionId, principal.getUid(), request));
    }

}
