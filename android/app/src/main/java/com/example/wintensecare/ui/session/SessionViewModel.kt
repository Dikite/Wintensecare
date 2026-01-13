package com.example.wintensecare.ui.session

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.example.wintensecare.data.api.ApiClient
import com.example.wintensecare.data.datastore.DeviceStore
import com.example.wintensecare.data.datastore.TokenStore
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

class SessionViewModel(application: Application) : AndroidViewModel(application) {

    private val tokenStore = TokenStore(application.applicationContext)
    private val deviceStore = DeviceStore(application.applicationContext)

    private val _sessionState =
        MutableStateFlow<SessionState>(SessionState.Loading)
    val sessionState: StateFlow<SessionState> = _sessionState

    init {
        observeSession()
        observeLogoutEvents()
    }

    private fun observeSession() {
        viewModelScope.launch {
            combine(
                tokenStore.tokenFlow,
                deviceStore.selectedDeviceFlow
            ) { token, deviceId ->
                ApiClient.updateToken(token) // ✅ THIS IS CORRECT
                token to deviceId
            }.collect { (token, deviceId) ->

                _sessionState.value =
                    when {
                        token.isNullOrEmpty() ->
                            SessionState.LoggedOut
                        deviceId.isNullOrEmpty() ->
                            SessionState.LoggedInNoDevice
                        else ->
                            SessionState.LoggedInWithDevice(deviceId)
                    }
            }
        }
    }

    private fun observeLogoutEvents() {
        viewModelScope.launch {
            SessionEvents.logout.collect {
                logout()
            }
        }
    }

    fun setSelectedDevice(deviceId: String) {
        viewModelScope.launch {
            deviceStore.saveSelectedDevice(deviceId)
        }
    }

    fun clearSelectedDevice() {
        viewModelScope.launch {
            deviceStore.clearSelectedDevice()
        }
    }

    fun logout() {
        viewModelScope.launch {
            tokenStore.clearToken()
            deviceStore.clearSelectedDevice()
        }
    }
}
