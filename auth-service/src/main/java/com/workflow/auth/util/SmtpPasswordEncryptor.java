package com.workflow.auth.util;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

@Component
@Slf4j
public class SmtpPasswordEncryptor {

    private static final String ALGORITHM = "AES";
    private static final String TRANSFORMATION = "AES";
    
    @Value("${smtp.encryption.key:WorkflowDesignerSMTPKey1234567890123456}")
    private String encryptionKey;

    /**
     * Encrypts SMTP password using AES encryption
     * @param plainPassword the plain text password
     * @return encrypted password (Base64 encoded)
     */
    public String encrypt(String plainPassword) {
        if (plainPassword == null || plainPassword.isEmpty()) {
            return null;
        }
        
        try {
            // Ensure key is 32 bytes (256 bits) for AES-256
            byte[] keyBytes = ensureKeyLength(encryptionKey);
            SecretKeySpec secretKey = new SecretKeySpec(keyBytes, ALGORITHM);
            
            Cipher cipher = Cipher.getInstance(TRANSFORMATION);
            cipher.init(Cipher.ENCRYPT_MODE, secretKey);
            
            byte[] encryptedBytes = cipher.doFinal(plainPassword.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(encryptedBytes);
        } catch (Exception e) {
            log.error("Error encrypting SMTP password", e);
            throw new RuntimeException("Failed to encrypt SMTP password", e);
        }
    }

    /**
     * Decrypts SMTP password
     * @param encryptedPassword the encrypted password (Base64 encoded)
     * @return decrypted plain text password
     */
    public String decrypt(String encryptedPassword) {
        if (encryptedPassword == null || encryptedPassword.isEmpty()) {
            return null;
        }
        
        try {
            // Ensure key is 32 bytes (256 bits) for AES-256
            byte[] keyBytes = ensureKeyLength(encryptionKey);
            SecretKeySpec secretKey = new SecretKeySpec(keyBytes, ALGORITHM);
            
            Cipher cipher = Cipher.getInstance(TRANSFORMATION);
            cipher.init(Cipher.DECRYPT_MODE, secretKey);
            
            byte[] decodedBytes = Base64.getDecoder().decode(encryptedPassword);
            byte[] decryptedBytes = cipher.doFinal(decodedBytes);
            return new String(decryptedBytes, StandardCharsets.UTF_8);
        } catch (Exception e) {
            log.error("Error decrypting SMTP password", e);
            throw new RuntimeException("Failed to decrypt SMTP password", e);
        }
    }

    /**
     * Ensures the encryption key is exactly 32 bytes (256 bits) for AES-256
     */
    private byte[] ensureKeyLength(String key) {
        byte[] keyBytes = key.getBytes(StandardCharsets.UTF_8);
        if (keyBytes.length == 32) {
            return keyBytes;
        } else if (keyBytes.length < 32) {
            // Pad with zeros if too short
            byte[] paddedKey = new byte[32];
            System.arraycopy(keyBytes, 0, paddedKey, 0, keyBytes.length);
            return paddedKey;
        } else {
            // Truncate if too long
            byte[] truncatedKey = new byte[32];
            System.arraycopy(keyBytes, 0, truncatedKey, 0, 32);
            return truncatedKey;
        }
    }
}
