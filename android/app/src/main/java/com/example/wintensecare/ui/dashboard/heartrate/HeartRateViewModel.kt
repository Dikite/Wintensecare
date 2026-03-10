package com.example.wintensecare.ui.heartrate

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.wintensecare.data.api.*
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import retrofit2.HttpException

data class HeartRateUiState(
    val avg: Int = 0,
    val min: Int = 0,
    val max: Int = 0,
    val points: List<Int> = emptyList(),
    val labels: List<String> = emptyList()
)

class HeartRateViewModel : ViewModel() {

    private val api =
        ApiClient.retrofit.create(TelemetryApi::class.java)

    private val _range =
        MutableStateFlow(TelemetryRange.H1)
    val range: StateFlow<TelemetryRange> = _range

    private val _state =
        MutableStateFlow(HeartRateUiState())
    val state: StateFlow<HeartRateUiState> = _state

    fun setRange(value: TelemetryRange) {
        _range.value = value
    }

    fun load(deviceId: String) {
        viewModelScope.launch {
            try {
                val res = api.getTelemetryHistory(
                    deviceId = deviceId,
                    range = _range.value.apiValue
                )

                _state.value = HeartRateUiState(
                    avg = res.summary.avgHeartRate,
                    min = res.summary.minHeartRate,
                    max = res.summary.maxHeartRate,
                    points = res.points.map { it.heartRate },
                    labels = res.points.map { it.ts }
                )

            } catch (e: HttpException) {
                _state.value = HeartRateUiState()
            } catch (e: Exception) {
                _state.value = HeartRateUiState()
            }
        }
    }
}
