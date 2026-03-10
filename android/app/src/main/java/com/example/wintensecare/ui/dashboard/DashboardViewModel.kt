package com.example.wintensecare.ui.dashboard

import android.app.Application
import android.os.Build
import androidx.annotation.RequiresApi
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.example.wintensecare.data.api.ApiClient
import com.example.wintensecare.data.api.TelemetryApi
import com.example.wintensecare.data.api.TelemetryItem
import com.example.wintensecare.ui.session.SessionEvents
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import retrofit2.HttpException
import java.time.LocalDate
import java.time.OffsetDateTime
import java.time.ZoneOffset

/* ---------------- UI STATE ---------------- */

sealed class DashboardUiState {
    object Loading : DashboardUiState()

    data class Success(
        val latestHeartRate: Int,
        val todaySteps: Int,
        val battery: Int,
        val status: DashboardStatus,
        val lastUpdated: OffsetDateTime // ✅ NEW
    ) : DashboardUiState()


    data class Error(val message: String) : DashboardUiState()
}

enum class DashboardStatus {
    NORMAL,
    WARNING,
    CRITICAL,
    LOW_BATTERY
}

/* ---------------- VIEWMODEL ---------------- */

class DashboardViewModel(application: Application) :
    AndroidViewModel(application) {

    private val telemetryApi =
        ApiClient.retrofit.create(TelemetryApi::class.java)

    private val _uiState =
        MutableStateFlow<DashboardUiState>(DashboardUiState.Loading)
    val uiState: StateFlow<DashboardUiState> = _uiState

    @RequiresApi(Build.VERSION_CODES.O)
    fun loadTelemetry(deviceId: String) {
        viewModelScope.launch {
            try {
                val list = telemetryApi.getTelemetry(
                    deviceId = deviceId,
                    range = "1h"
                )

                if (list.isEmpty()) {
                    _uiState.value =
                        DashboardUiState.Error("No telemetry data")
                    return@launch
                }

                // ✅ ALWAYS sort by time
                val sorted =
                    list.sortedByDescending {
                        OffsetDateTime.parse(it.createdAt)
                    }

                val latest = sorted.first()

                val heartRate = latest.heartRate
                val battery = latest.battery

                val today = LocalDate.now(ZoneOffset.UTC)

                val todaySteps =
                    sorted
                        .filter {
                            OffsetDateTime.parse(it.createdAt)
                                .toLocalDate() == today
                        }
                        .sumOf { it.steps }

                val status =
                    calculateStatus(
                        heartRate = heartRate,
                        battery = battery
                    )

                val lastUpdated =
                    OffsetDateTime.parse(latest.createdAt)

                _uiState.value =
                    DashboardUiState.Success(
                        latestHeartRate = heartRate,
                        todaySteps = todaySteps,
                        battery = battery,
                        status = status,
                        lastUpdated = lastUpdated
                    )


            } catch (e: HttpException) {
                if (e.code() == 401) {
                    SessionEvents.emitLogout()
                    return@launch
                }

                _uiState.value =
                    DashboardUiState.Error("Unable to fetch data")

            } catch (e: Exception) {
                _uiState.value =
                    DashboardUiState.Error("Unexpected error")
            }
        }
    }

    private fun calculateStatus(
        heartRate: Int,
        battery: Int
    ): DashboardStatus =
        when {
            heartRate >= 200 -> DashboardStatus.CRITICAL
            heartRate >= 170 -> DashboardStatus.WARNING
            battery < 15 -> DashboardStatus.LOW_BATTERY
            else -> DashboardStatus.NORMAL
        }
}
