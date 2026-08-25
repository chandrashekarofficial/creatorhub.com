package com.creatorhub.controller;

import com.creatorhub.dto.report.ReportRequest;
import com.creatorhub.dto.report.ReportResponse;
import com.creatorhub.service.ReportService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @PostMapping
    public ResponseEntity<ReportResponse> create(
            @Valid @RequestBody ReportRequest request,
            Authentication authentication
    ) {
        Long userId = getUserId(authentication);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(reportService.create(request, userId));
    }

    @GetMapping
    public List<ReportResponse> getAll(
            Authentication authentication
    ) {
        Long userId = getUserId(authentication);

        return reportService.getAll(userId);
    }

    @GetMapping("/{reportId}")
    public ReportResponse getById(
            @PathVariable Long reportId,
            Authentication authentication
    ) {
        Long userId = getUserId(authentication);

        return reportService.getById(reportId, userId);
    }

    @PutMapping("/{reportId}")
    public ReportResponse update(
            @PathVariable Long reportId,
            @Valid @RequestBody ReportRequest request,
            Authentication authentication
    ) {
        Long userId = getUserId(authentication);

        return reportService.update(
                reportId,
                request,
                userId
        );
    }

    @DeleteMapping("/{reportId}")
    public ResponseEntity<Void> delete(
            @PathVariable Long reportId,
            Authentication authentication
    ) {
        Long userId = getUserId(authentication);

        reportService.delete(reportId, userId);

        return ResponseEntity.noContent().build();
    }

    private Long getUserId(Authentication authentication) {
        return Long.valueOf(authentication.getName());
    }
}