package com.example.wintensecare.ui.session

sealed class SessionState {
    object Loading : SessionState()
    object LoggedOut : SessionState()
    object LoggedInNoDevice : SessionState()
    data class LoggedInWithDevice(val deviceId: String) : SessionState()
}
