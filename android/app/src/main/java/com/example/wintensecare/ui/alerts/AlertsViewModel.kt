package com.example.wintensecare.ui.alerts

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.example.wintensecare.data.api.Alert
import com.example.wintensecare.data.api.AlertApi
import com.example.wintensecare.data.api.ApiClient
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

class AlertsViewModel(application: Application) : AndroidViewModel(application) {

    private val alertApi =
        ApiClient.retrofit.create(AlertApi::class.java)




    private val _alerts = MutableStateFlow<List<Alert>>(emptyList())
    val alerts: StateFlow<List<Alert>> = _alerts

    fun loadAlerts() {
        viewModelScope.launch {
            _alerts.value = alertApi.getAlerts()
        }
    }

    fun acknowledge(alertId: String) {
        viewModelScope.launch {
            alertApi.acknowledgeAlert(alertId)
            loadAlerts() // refresh
        }
    }
}
