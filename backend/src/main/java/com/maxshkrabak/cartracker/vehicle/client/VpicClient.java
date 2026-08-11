package com.maxshkrabak.cartracker.vehicle.client;

import com.maxshkrabak.cartracker.vehicle.exception.VpicUnavailableException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import tools.jackson.databind.JsonNode;

@Component
@RequiredArgsConstructor
public class VpicClient {
    private final RestClient vpicRestClient;

    public JsonNode decode(String vin) {
        JsonNode root;
        try {
            root = vpicRestClient.get().uri("/DecodeVinValues/{vin}?format=json", vin).retrieve().body(JsonNode.class);
        } catch (RestClientException e) {
            throw new VpicUnavailableException();
        }

        if (root == null || !root.path("Results").isArray() || root.path("Results").isEmpty()) {
            throw new VpicUnavailableException();
        }

        return root.path("Results").get(0);
    }
}
