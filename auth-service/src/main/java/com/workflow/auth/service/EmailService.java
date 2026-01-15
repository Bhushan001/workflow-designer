package com.workflow.auth.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.stereotype.Service;

import java.util.Properties;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    /**
     * Creates a JavaMailSender instance with the provided SMTP configuration
     */
    public JavaMailSender createMailSender(String host, Integer port, String username, String password, Boolean enableTls) {
        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
        mailSender.setHost(host);
        mailSender.setPort(port != null ? port : 587);
        mailSender.setUsername(username);
        mailSender.setPassword(password);

        Properties props = mailSender.getJavaMailProperties();
        props.put("mail.transport.protocol", "smtp");
        props.put("mail.smtp.auth", "true");
        
        if (Boolean.TRUE.equals(enableTls)) {
            props.put("mail.smtp.starttls.enable", "true");
            props.put("mail.smtp.starttls.required", "true");
        }
        
        // Additional properties for better compatibility
        props.put("mail.smtp.connectiontimeout", "5000");
        props.put("mail.smtp.timeout", "5000");
        props.put("mail.smtp.writetimeout", "5000");

        return mailSender;
    }

    /**
     * Sends a test email to verify SMTP configuration
     */
    public void sendTestEmail(JavaMailSender mailSender, String fromEmail, String fromName, String toEmail) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail != null ? (fromName != null ? fromName + " <" + fromEmail + ">" : fromEmail) : fromEmail);
            message.setTo(toEmail);
            message.setSubject("SMTP Configuration Test - Workflow Designer");
            message.setText("This is a test email to verify SMTP configuration.\n\n" +
                    "If you received this email, your SMTP settings are configured correctly.\n\n" +
                    "This is an automated message from Workflow Designer Platform Settings.");
            
            mailSender.send(message);
            log.info("Test email sent successfully to: {}", toEmail);
        } catch (Exception e) {
            log.error("Error sending test email to: {}", toEmail, e);
            throw new RuntimeException("Failed to send test email: " + e.getMessage(), e);
        }
    }
}
