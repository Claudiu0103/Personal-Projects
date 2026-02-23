package com.example.musify.exception;

import com.example.musify.dto.ApiError;
import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.*;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.transaction.TransactionSystemException;
import org.springframework.validation.FieldError;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;
@Slf4j
@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<ApiError> handleNotFound(EntityNotFoundException ex,
                                                   HttpServletRequest req) {
        log.error("Entity not found at {}: {}", req.getRequestURI(), ex.getMessage(), ex);
        return buildError(HttpStatus.NOT_FOUND, "Not Found", ex.getMessage(), req.getRequestURI());
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiError> handleIllegalArg(IllegalArgumentException ex,
                                                     HttpServletRequest req) {
        log.error("Illegal argument at {}: {}", req.getRequestURI(), ex.getMessage(), ex);
        return buildError(HttpStatus.BAD_REQUEST, "Bad Request", ex.getMessage(), req.getRequestURI());
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiError> handleUnreadable(HttpMessageNotReadableException ex,
                                                     HttpServletRequest req) {
        log.error("Unreadable message at {}: {}", req.getRequestURI(), ex.getMessage(), ex);
        return buildError(HttpStatus.BAD_REQUEST, "Malformed JSON", ex.getMostSpecificCause().getMessage(), req.getRequestURI());
    }

    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<ApiError> handleMethodNotAllowed(HttpRequestMethodNotSupportedException ex,
                                                           HttpServletRequest req) {
        String msg = String.format("Method %s not supported for this endpoint", ex.getMethod());
        log.error("Method not allowed at {}: {}", req.getRequestURI(), msg, ex);
        return buildError(HttpStatus.METHOD_NOT_ALLOWED, "Method Not Allowed", msg, req.getRequestURI());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError> handleValidationErrors(MethodArgumentNotValidException ex,
                                                           HttpServletRequest req) {
        List<String> errors = ex.getBindingResult().getFieldErrors().stream()
                .map(fe -> fe.getField() + ": " + fe.getDefaultMessage())
                .collect(Collectors.toList());

        String message = String.join("; ", errors);
        log.error("Validation failed at {}: {}", req.getRequestURI(), message, ex);

        ApiError err = new ApiError(
                Instant.now(),
                HttpStatus.BAD_REQUEST.value(),
                "Validation Failed",
                String.join("; ", errors),
                req.getRequestURI()
        );
        return new ResponseEntity<>(err, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ApiError> handleConstraintViolations(ConstraintViolationException ex,
                                                               HttpServletRequest req) {
        List<String> errors = ex.getConstraintViolations().stream()
                .map(ConstraintViolation::getMessage)
                .collect(Collectors.toList());

        String message = String.join("; ", errors);
        log.error("Constraint violation at {}: {}", req.getRequestURI(), message, ex);
        ApiError err = new ApiError(
                Instant.now(),
                HttpStatus.BAD_REQUEST.value(),
                "Constraint Violation",
                String.join("; ", errors),
                req.getRequestURI()
        );
        return new ResponseEntity<>(err, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ApiError> handleDataIntegrity(DataIntegrityViolationException ex,
                                                        HttpServletRequest req) {
        String msg = ex.getMostSpecificCause().getMessage();
        log.error("Data integrity violation at {}: {}", req.getRequestURI(), msg, ex);
        return buildError(HttpStatus.CONFLICT, "Data Integrity Violation", msg, req.getRequestURI());
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiError> handleAccessDenied(AccessDeniedException ex,
                                                       HttpServletRequest req) {
        log.error("Access denied at {}: {}", req.getRequestURI(), ex.getMessage(), ex);
        return buildError(HttpStatus.FORBIDDEN, "Access Denied", ex.getMessage(), req.getRequestURI());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiError> handleAll(Exception ex,
                                              HttpServletRequest req) {
        log.error("Unhandled exception at {}: {}", req.getRequestURI(), ex.getMessage(), ex);
        return buildError(HttpStatus.INTERNAL_SERVER_ERROR, "Internal Server Error", ex.getMessage(), req.getRequestURI());
    }

    private ResponseEntity<ApiError> buildError(HttpStatus status, String error, String message, String path) {
        ApiError err = new ApiError(Instant.now(), status.value(), error, message, path);
        log.error(err.getMessage(), err);
        return new ResponseEntity<>(err, status);
    }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<ApiError> handleIllegalState(
            IllegalStateException ex,
            HttpServletRequest req
    ) {
        //  409 Conflict da il putem schimba nu ii stres
        log.error("Illegal state at {}: {}", req.getRequestURI(), ex.getMessage(), ex);
        return buildError(
                HttpStatus.CONFLICT,
                "Illegal State",
                ex.getMessage(),
                req.getRequestURI()
        );
    }
}
