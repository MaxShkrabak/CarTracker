package com.maxshkrabak.cartracker.vehicle.service;

import com.maxshkrabak.cartracker.vehicle.client.VpicClient;
import com.maxshkrabak.cartracker.vehicle.dto.VinDecodeResponse;
import com.maxshkrabak.cartracker.vehicle.exception.VinDecodeException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import tools.jackson.databind.JsonNode;

@Service
@RequiredArgsConstructor
public class VinDecodeService {
    private final VpicClient vpicClient;

    public VinDecodeResponse decodeVin(String vin) {
        JsonNode result = vpicClient.decode(vin);

        if (!"0".equals(result.path("ErrorCode").asString())) {
            throw new VinDecodeException();
        }

        return new VinDecodeResponse(
                result.path("Make").asString(),
                result.path("BodyClass").asString(),
                result.path("Doors").asInt(),
                result.path("EngineCylinders").asInt(),
                result.path("EngineHP").asInt(),
                result.path("Model").asString(),
                result.path("ModelYear").asInt(),
                result.path("TransmissionStyle").asString(),
                result.path("Trim").asString(),
                result.path("VIN").asString()
        );
    }
}
