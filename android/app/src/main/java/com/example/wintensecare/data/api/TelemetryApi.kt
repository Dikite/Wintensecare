package com.example.wintensecare.data.api

import retrofit2.http.GET
import retrofit2.http.Query

interface TelemetryApi {

    // DASHBOARD
    @GET("telemetry")
    suspend fun getTelemetry(
        @Query("deviceId") deviceId: String,
        @Query("range") range: String
    ): List<TelemetryItem>

    // DETAILS
    @GET("telemetry/history")
    suspend fun getTelemetryHistory(
        @Query("deviceId") deviceId: String,
        @Query("range") range: String
    ): TelemetryHistoryResponse
}

/* ---------- MODELS ---------- */

data class TelemetryItem(
    val id: String,
    val deviceId: String,
    val heartRate: Int,
    val steps: Int,
    val battery: Int,
    val createdAt: String
)

data class TelemetryHistoryResponse(
    val range: String,
    val points: List<TelemetryPoint>,
    val summary: TelemetrySummary
)

data class TelemetryPoint(
    val ts: String,
    val heartRate: Int
)

data class TelemetrySummary(
    val avgHeartRate: Int,
    val maxHeartRate: Int,
    val minHeartRate: Int,
    val steps: Int,
    val battery: Int
)

/* ---------- RANGE ENUM (CRITICAL) ---------- */

enum class TelemetryRange(
    val label: String,
    val apiValue: String
) {
    M30("30m", "30m"),
    H1("1h", "1h"),
    H8("8h", "8h"),
    D1("1d", "1d"),
    W1("7d", "7d")
}
