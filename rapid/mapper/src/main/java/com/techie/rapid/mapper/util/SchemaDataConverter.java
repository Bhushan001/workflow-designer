package com.techie.rapid.mapper.util;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.techie.rapid.mapper.entity.Mapping;
import com.techie.rapid.mapper.entity.RequestSchema;
import com.techie.rapid.mapper.entity.S1Schema;

import java.io.IOException;

public class SchemaDataConverter {
    public static JsonNode convertSchemaDataToJson(RequestSchema requestSchema) throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        if (requestSchema.getSchemaData() == null) {
            return null; // Or throw an exception, depending on your error handling
        }
        String schemaData = new String(requestSchema.getSchemaData()); // Directly create String from byte array
        return objectMapper.readTree(schemaData);
    }

    public static JsonNode convertS1SchemaDataToJson(S1Schema s1Schema) throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        if (s1Schema.getSchemaData() == null) {
            return null; // Or throw an exception, depending on your error handling
        }
        String schemaData = new String(s1Schema.getSchemaData()); // Directly create String from byte array
        return objectMapper.readTree(schemaData);
    }

    public static JsonNode convertMappingDataToJson(Mapping mapping) throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        if (mapping.getSchemaData() == null) {
            return null; // Or throw an exception, depending on your error handling
        }
        String schemaData = new String(mapping.getSchemaData()); // Directly create String from byte array
        return objectMapper.readTree(schemaData);
    }
}
