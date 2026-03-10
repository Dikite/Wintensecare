package com.example.wintensecare.ui.login

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.example.wintensecare.data.api.ApiClient
import com.example.wintensecare.data.api.AuthApi
import com.example.wintensecare.data.api.LoginRequest
import com.example.wintensecare.data.datastore.TokenStore
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

class LoginViewModel(application: Application) : AndroidViewModel(application) {

    private val tokenStore = TokenStore(application)
    private val authApi = ApiClient.retrofit.create(AuthApi::class.java)

    private val _loginState = MutableStateFlow<LoginState>(LoginState.Idle)
    val loginState: StateFlow<LoginState> = _loginState

    fun login(identifier: String, password: String) {
        viewModelScope.launch {
            try {
                _loginState.value = LoginState.Loading

                val response = authApi.login(
                    LoginRequest(identifier, password)
                )

                // ✅ ONLY THIS
                tokenStore.saveToken(response.accessToken)

                _loginState.value = LoginState.Success
            } catch (e: Exception) {
                _loginState.value = LoginState.Error(
                    e.message ?: "Login failed"
                )
            }
        }
    }
}
