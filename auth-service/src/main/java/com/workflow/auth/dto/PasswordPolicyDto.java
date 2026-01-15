package com.workflow.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PasswordPolicyDto {
    private Integer passwordMinLength;
    private Boolean passwordRequireUppercase;
    private Boolean passwordRequireLowercase;
    private Boolean passwordRequireNumbers;
    private Boolean passwordRequireSpecialChars;
}
