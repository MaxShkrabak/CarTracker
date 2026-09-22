package com.maxshkrabak.cartracker.client;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

import com.maxshkrabak.cartracker.exception.VpicUnavailableException;

import tools.jackson.databind.JsonNode;

@Component
@RequiredArgsConstructor
public class VpicClient {
    private final RestClient vpicRestClient;

    // WEBSITE: https://vpic.nhtsa.dot.gov/api/
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
