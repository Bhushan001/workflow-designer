package com.workflow.auth.util;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
public class ValidationResult {
    private boolean valid;
    private List<String> errors;

    public ValidationResult() {
        this.valid = true;
        this.errors = new ArrayList<>();
    }

    public ValidationResult(boolean valid) {
        this.valid = valid;
        this.errors = new ArrayList<>();
    }

    public void addError(String error) {
        this.errors.add(error);
        this.valid = false;
    }

    public String getErrorMessage() {
        if (errors.isEmpty()) {
            return "";
        }
        return String.join(", ", errors);
    }
}
