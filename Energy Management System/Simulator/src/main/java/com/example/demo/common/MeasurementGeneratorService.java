package com.example.demo.common;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.IntStream;

@Service
public class MeasurementGeneratorService {

    private final RabbitTemplate rabbitTemplate;
    private final List<UUID> deviceIds;

    public MeasurementGeneratorService(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;

        // Generate 3 random UUID device IDs for this simulator instance
        UUID deviceId = UUID.fromString("de70ff96-ed93-43f3-b09a-61e8fd35980d");
        UUID deviceId2 = UUID.fromString("87f1efb8-523e-498f-a100-153a04979f66");
        this.deviceIds = List.of(deviceId,deviceId2);

        System.out.println("Simulator Device UUIDs:");
        deviceIds.forEach(System.out::println);
    }

    // Runs every 10 minutes (600000 ms)
    @Scheduled(fixedRate = 100000)
    // for testing: @Scheduled(fixedRate = 10000)
    public void generateMeasurements() {
        LocalDateTime now = LocalDateTime.now();

        for (UUID deviceId : deviceIds) {
            /*double value = generateConsumptionForTime(now);*/
            double value = 210.0;
            String timestamp = now.toString(); // ISO-8601

            MeasurementMessage message =
                    new MeasurementMessage(deviceId, timestamp, value);

            rabbitTemplate.convertAndSend(
                    RabbitConfig.DATA_EXCHANGE,
                    RabbitConfig.DATA_ROUTING_KEY,
                    message
            );

            System.out.printf("Sent measurement: %s %s %.3f kWh%n",
                    timestamp, deviceId, value);
        }
    }

    private double generateConsumptionForTime(LocalDateTime time) {
        int hour = time.getHour();
        double base;

        if (hour >= 0 && hour < 6) {
            base = 0.08;
        } else if (hour >= 6 && hour < 17) {
            base = 0.18;
        } else if (hour >= 17 && hour < 23) {
            base = 0.35;
        } else {
            base = 0.15;
        }

        double noise = (Math.random() - 0.5) * 0.05;
        double value = base + noise;

        return Math.max(value, 0.01);
    }
}
