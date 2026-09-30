package com.maxshkrabak.cartracker.service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.maxshkrabak.cartracker.exception.InvalidSessionIdException;
import com.maxshkrabak.cartracker.exception.VehicleNotFoundException;
import com.maxshkrabak.cartracker.mapper.DriveMapper;
import com.maxshkrabak.cartracker.model.dto.DriveSampleDTO;
import com.maxshkrabak.cartracker.model.dto.DriveSampleRequest;
import com.maxshkrabak.cartracker.model.dto.DriveSessionDTO;
import com.maxshkrabak.cartracker.model.dto.DriveSessionRequest;
import com.maxshkrabak.cartracker.model.entity.DriveSample;
import com.maxshkrabak.cartracker.model.entity.DriveSession;
import com.maxshkrabak.cartracker.model.entity.Vehicle;
import com.maxshkrabak.cartracker.repository.DriveSampleRepository;
import com.maxshkrabak.cartracker.repository.DriveSessionRepository;
import com.maxshkrabak.cartracker.repository.VehicleRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DriveService {

    private final DriveSampleRepository sampleRepo;
    private final DriveSessionRepository sessionRepo;
    private final DriveMapper driveMapper;
    private final VehicleRepository vehicleRepo;

    public List<DriveSampleDTO> getSamples(Long sessionId, Long uid) {
        // Session does NOT belong to user or does NOT exist
        sessionRepo.findUsersDriveSession(sessionId, uid).orElseThrow(InvalidSessionIdException::new);

        return driveMapper.toSampleDtoList(sampleRepo.findSessionSamples(sessionId));
    }

    public List<DriveSessionDTO> getVehicleSessions(Long vid, Long uid) {
        return driveMapper.toSessionDtoList(sessionRepo.findUsersVehicleDriveSessions(vid, uid));
    }

    @Transactional
    public DriveSessionDTO startSession(Long vid, Long uid, DriveSessionRequest request) {
        Vehicle vehicle = vehicleRepo.findByVidAndUserUid(vid, uid).orElseThrow(VehicleNotFoundException::new);

        sessionRepo.findByVehicle_VidAndEndedAtIsNull(vid).ifPresent(stale -> {
            List<DriveSample> staleSamples = sampleRepo.findSessionSamples(stale.getSessionId());
            Instant staleEnd = staleSamples.isEmpty() ? stale.getStartedAt()
                    : staleSamples.get(staleSamples.size() - 1).getRecordedAt();

            closeSession(stale, staleSamples, staleEnd);
        });

        DriveSession session = new DriveSession();
        session.setVehicle(vehicle);
        session.setStartedAt(request.startedAt() != null ? request.startedAt() : Instant.now());

        return driveMapper.toDto(sessionRepo.save(session));
    }

    @Transactional
    public void addSamples(Long sessionId, Long uid, List<DriveSampleRequest> requests) {
        DriveSession session = sessionRepo.findUsersDriveSession(sessionId, uid)
                .orElseThrow(InvalidSessionIdException::new);

        if (session.getEndedAt() != null) {
            throw new InvalidSessionIdException();
        }

        List<DriveSample> samples = new ArrayList<>();

        for (DriveSampleRequest r : requests) {
            DriveSample sample = driveMapper.toEntity(r);
            sample.setDriveSession(session);
            samples.add(sample);
        }

        sampleRepo.saveAll(samples);
    }

    @Transactional
    public DriveSessionDTO endSession(Long sessionId, Long uid, DriveSessionRequest request) {
        DriveSession session = sessionRepo.findUsersDriveSession(sessionId, uid)
                .orElseThrow(InvalidSessionIdException::new);

        if (session.getEndedAt() != null) {
            throw new InvalidSessionIdException();
        }

        List<DriveSample> samples = sampleRepo.findSessionSamples(sessionId);
        closeSession(session, samples,
                request != null && request.endedAt() != null ? request.endedAt() : Instant.now());

        return driveMapper.toDto(session);
    }

    private void closeSession(DriveSession session, List<DriveSample> samples, Instant endedAt) {
        session.setEndedAt(endedAt);

        Integer maxRPM = null;
        Integer maxKPH = null;
        Integer maxCoolant = null;
        long rpmSum = 0, kphSum = 0;
        int rpmCount = 0, kphCount = 0;

        for (DriveSample s : samples) {
            // RPM
            if (s.getRpm() != null) {
                maxRPM = (maxRPM == null) ? s.getRpm() : Math.max(maxRPM, s.getRpm());
                rpmSum += s.getRpm();
                rpmCount++;
            }

            // KPH (Speed)
            if (s.getKph() != null) {
                maxKPH = (maxKPH == null) ? s.getKph() : Math.max(maxKPH, s.getKph());
                kphSum += s.getKph();
                kphCount++;
            }

            // Coolant Temp (C)
            if (s.getCoolantTempC() != null) {
                maxCoolant = (maxCoolant == null) ? s.getCoolantTempC() : Math.max(maxCoolant, s.getCoolantTempC());
            }
        }

        session.setMaxRPM(maxRPM);
        session.setMaxKPH(maxKPH);
        session.setMaxCoolantTempC(maxCoolant);
        session.setAvgRPM(rpmCount == 0 ? null : (double) rpmSum / rpmCount);
        session.setAvgKPH(kphCount == 0 ? null : (double) kphSum / kphCount);
        session.setSampleCount(samples.size());
    }
}
