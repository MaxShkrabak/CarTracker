package com.maxshkrabak.cartracker.service;

import org.springframework.stereotype.Service;

import com.maxshkrabak.cartracker.client.VpicClient;
import com.maxshkrabak.cartracker.exception.VinDecodeException;
import com.maxshkrabak.cartracker.model.dto.VinDecodeResponse;

import lombok.RequiredArgsConstructor;
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
                asIntOrZero(result, "EngineCylinders"),
                asIntOrZero(result, "EngineHP"),
                result.path("Model").asString(),
                asIntOrZero(result, "ModelYear"),
                result.path("TransmissionStyle").asString(),
                result.path("Trim").asString(),
                result.path("VIN").asString());
    }
}
