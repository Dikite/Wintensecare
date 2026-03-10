package com.example.wintensecare.ui.steps

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.wintensecare.data.api.ApiClient
import com.example.wintensecare.data.api.TelemetryApi
import com.example.wintensecare.data.api.TelemetryRange
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import retrofit2.HttpException

sealed class StepsUiState {
    object Loading : StepsUiState()
    data class Success(
        val totalSteps: Int
    ) : StepsUiState()

    data class Error(val message: String) : StepsUiState()
}

class StepsViewModel : ViewModel() {

    private val api =
        ApiClient.retrofit.create(TelemetryApi::class.java)

    private val _range =
        MutableStateFlow(TelemetryRange.W1)
    val range: StateFlow<TelemetryRange> = _range

    private val _uiState =
        MutableStateFlow<StepsUiState>(StepsUiState.Loading)
    val uiState: StateFlow<StepsUiState> = _uiState

    fun setRange(range: TelemetryRange) {
        _range.value = range
    }

    fun load(deviceId: String) {
        viewModelScope.launch {
            _uiState.value = StepsUiState.Loading

            try {
                val response =
                    api.getTelemetryHistory(
                        deviceId = deviceId,
                        range = _range.value.apiValue
                    )

                _uiState.value =
                    StepsUiState.Success(
                        totalSteps = response.summary.steps
                    )

            } catch (e: HttpException) {
                _uiState.value =
                    StepsUiState.Error("Unable to load steps")
            } catch (e: Exception) {
                _uiState.value =
                    StepsUiState.Error("Unexpected error")
            }
        }
    }
}
