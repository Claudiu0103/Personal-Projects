package com.example.musify.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins(
                        "http://localhost:4200",
                        "https://musifyfe4java-gwc7eebwh7dzg7cr.eastus2-01.azurewebsites.net"
                )
                .allowedMethods("GET","POST","PUT","PATCH","DELETE","OPTIONS")
                .allowedHeaders("*")
                .exposedHeaders("Set-Cookie","Access-Control-Allow-Credentials")
                .allowCredentials(true)
                .maxAge(3600);
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        return request -> {
            String origin = request.getHeader("Origin");
            if (origin == null) {
                return null; // Fără origine, returnează null
            }
            CorsConfiguration config = new CorsConfiguration();
            config.addAllowedOriginPattern("https://musifyfe4java-gwc7eebwh7dzg7cr.eastus2-01.azurewebsites.net:*");
            config.addAllowedOrigin(origin); // Setează originea cererii
            config.addAllowedHeader("*");
            config.addAllowedMethod("GET");
            config.addAllowedMethod("POST");
            config.addAllowedMethod("PUT");
            config.addAllowedMethod("PATCH");
            config.addAllowedMethod("DELETE");
            config.addAllowedMethod("OPTIONS");
            config.setAllowCredentials(true);
            config.setMaxAge(3600L);
            return config;
        };
    }
}