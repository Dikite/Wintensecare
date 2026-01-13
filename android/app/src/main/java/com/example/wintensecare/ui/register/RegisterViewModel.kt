package com.example.wintensecare.ui.register

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.example.wintensecare.data.api.ApiClient
import com.example.wintensecare.data.api.AuthApi
import com.example.wintensecare.data.api.RegisterRequest
import com.example.wintensecare.data.datastore.TokenStore
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

sealed class RegisterState {
    object Idle : RegisterState()
    object Loading : RegisterState()
    object Success : RegisterState()
    data class Error(val message: String) : RegisterState()
}

class RegisterViewModel(application: Application) : AndroidViewModel(application) {

    private val api = ApiClient.retrofit.create(AuthApi::class.java)
    private val tokenStore = TokenStore(application)

    private val _state = MutableStateFlow<RegisterState>(RegisterState.Idle)
    val state: StateFlow<RegisterState> = _state

    fun register(identifier: String, password: String, confirm: String) {
        viewModelScope.launch {
            try {
                _state.value = RegisterState.Loading

                val response = api.register(
                    RegisterRequest(identifier, password, confirm)
                )

                tokenStore.saveToken(response.accessToken)

                _state.value = RegisterState.Success
            } catch (e: Exception) {
                _state.value = RegisterState.Error(
                    e.message ?: "Registration failed"
                )
            }
        }
    }
}
