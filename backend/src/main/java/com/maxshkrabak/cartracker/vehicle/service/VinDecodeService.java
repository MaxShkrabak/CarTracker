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

    private int asIntOrZero(JsonNode node, String field) {
        return node.path(field).asInt(0);
    }

    public VinDecodeResponse decodeVin(String vin) {
        JsonNode result = vpicClient.decode(vin);

        if (!"0".equals(result.path("ErrorCode").asString())) {
            throw new VinDecodeException();
        }

        return new VinDecodeResponse(
                result.path("Make").asString(),
                result.path("BodyClass").asString(),
                asIntOrZero(result, "Doors"),
                asIntOrZero(result, "EngineCylinders"),
                asIntOrZero(result, "EngineHP"),
                result.path("Model").asString(),
                asIntOrZero(result, "ModelYear"),
                result.path("TransmissionStyle").asString(),
                result.path("Trim").asString(),
                result.path("VIN").asString()
        );
    }
}
