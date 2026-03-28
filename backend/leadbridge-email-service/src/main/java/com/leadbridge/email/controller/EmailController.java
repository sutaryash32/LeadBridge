package com.leadbridge.email.controller;

import com.leadbridge.common.dto.ApiResponse;
import com.leadbridge.email.dto.BulkEmailRequestDto;
import com.leadbridge.email.dto.EmailRequestDto;
import com.leadbridge.email.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/emails")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ENTERPRISE_TENANT') or hasRole('MSSP') or hasRole('MASTER_MSSP')")
public class EmailController {

    private final EmailService emailService;

    @PostMapping("/send")
    public ResponseEntity<ApiResponse<Void>> sendEmail(@RequestBody EmailRequestDto request) {
        emailService.sendSingle(request);
        return ResponseEntity.ok(ApiResponse.success(null, "Email has been queued for sending."));
    }

    @PostMapping("/bulk")
    public ResponseEntity<ApiResponse<Void>> sendBulkEmail(@RequestBody BulkEmailRequestDto request) {
        emailService.sendBulk(request);
        return ResponseEntity.ok(ApiResponse.success(null, "Bulk emails have been queued."));
    }
}
