package com.example.demo.common;

import java.util.UUID;

public class MeasurementMessage {
    private UUID deviceId;
    private String timestamp;        // ISO string
    private double measurementValue; // kWh in 10 minute

    public MeasurementMessage() {}

    public MeasurementMessage(UUID deviceId, String timestamp, double measurementValue) {
        this.deviceId = deviceId;
        this.timestamp = timestamp;
        this.measurementValue = measurementValue;
    }

    public UUID getDeviceId() {
        return deviceId;
    }

    public void setDeviceId(UUID deviceId) {
        this.deviceId = deviceId;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }

    public double getMeasurementValue() {
        return measurementValue;
    }

    public void setMeasurementValue(double measurementValue) {
        this.measurementValue = measurementValue;
    }
}
