package com.studypulse.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class SubjectAlreadyExistsException extends RuntimeException {

    public SubjectAlreadyExistsException(String message) {
        super(message);
    }
}