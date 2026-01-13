package com.example.wintensecare.ui.dashboard.model

enum class Severity {
    WARNING,
    CRITICAL
}

data class AlertMarker(
    val index: Int,
    val severity: Severity
)