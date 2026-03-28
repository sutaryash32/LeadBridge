package com.leadbridge.email.service;

import com.leadbridge.email.dto.BulkEmailRequestDto;
import com.leadbridge.email.dto.EmailRequestDto;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;

    @Async
    public void sendSingle(EmailRequestDto request) {
        try {
            sendEmail(request.getTo(), request.getSubject(), request.getTemplateName(), request.getVariables());
            log.info("Email sent to {}", request.getTo());
        } catch (Exception e) {
            log.error("Failed to send email to {}", request.getTo(), e);
        }
    }

    @Async
    public void sendBulk(BulkEmailRequestDto request) {
        // In a real system, you'd fetch the email addresses of these lead IDs
        // potentially via WebClient or FeignClient to the lead-service.
        // For demonstration purposes, we will mock the process for "bulk".
        log.info("Processing bulk emails for {} leads", request.getLeadIds().size());
        for (java.util.UUID leadId : request.getLeadIds()) {
            try {
                // Mock user lead email
                String mockEmail = "user-" + leadId + "@example.com";
                sendEmail(mockEmail, request.getSubject(), request.getTemplateName(), request.getVariables());
            } catch (Exception e) {
                log.error("Failed to send bulk email for lead {}", leadId, e);
            }
        }
    }

    private void sendEmail(String to, String subject, String templateName, Map<String, Object> variables) throws MessagingException {
        Context context = new Context();
        if (variables != null) {
            context.setVariables(variables);
        }
        
        String htmlContent = templateEngine.process(templateName, context);
        
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(htmlContent, true);
        
        mailSender.send(message);
    }
}
