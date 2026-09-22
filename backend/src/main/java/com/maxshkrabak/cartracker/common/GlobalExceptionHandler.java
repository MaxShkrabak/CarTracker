package com.maxshkrabak.cartracker.common;

import com.maxshkrabak.cartracker.exception.InvalidPasswordException;
import com.maxshkrabak.cartracker.exception.UserAccountDoesNotExist;
import com.maxshkrabak.cartracker.exception.UsernameAlreadyExistsException;
import com.maxshkrabak.cartracker.exception.VehicleNotFoundException;
import com.maxshkrabak.cartracker.exception.VinDecodeException;
import com.maxshkrabak.cartracker.exception.VpicUnavailableException;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    /* ------ Auth Exceptions ------ */
    @ExceptionHandler(UsernameAlreadyExistsException.class)
    public ResponseEntity<String> handleUsernameExists(UsernameAlreadyExistsException e) {
        return new ResponseEntity<>(e.getMessage(), HttpStatus.CONFLICT);
    }

    @ExceptionHandler(UserAccountDoesNotExist.class)
    public ResponseEntity<String> handleAccountDoesNotExist(UserAccountDoesNotExist e) {
        return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(InvalidPasswordException.class)
    public ResponseEntity<String> handleInvalidPassword(InvalidPasswordException e) {
        return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
    }

    /* ----- Vehicle Exceptions ------ */
    @ExceptionHandler(VehicleNotFoundException.class)
    public ResponseEntity<String> handleVehicleDoesNotExist(VehicleNotFoundException e) {
        return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
    }

    /* ----- Vin Decoding Exceptions ----- */
    @ExceptionHandler(VinDecodeException.class)
    public ResponseEntity<String> handleVinDecodeException(VinDecodeException e) {
        return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(VpicUnavailableException.class)
    public ResponseEntity<String> handleVpicUnavailableException(VpicUnavailableException e) {
        return new ResponseEntity<>(e.getMessage(), HttpStatus.GATEWAY_TIMEOUT);
    }
}
