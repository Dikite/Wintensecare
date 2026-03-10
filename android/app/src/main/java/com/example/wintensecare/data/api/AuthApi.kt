package com.example.wintensecare.data.api

import retrofit2.http.Body
import retrofit2.http.POST

// -------- REQUEST MODELS --------
data class LoginRequest(
    val identifier: String,
    val password: String
)

data class HeartRatePoint(
    val bpm: Int,
    val time: String
)

data class RegisterRequest(
    val identifier: String,
    val password: String,
    val confirmPassword: String
)


data class RegisterResponse(
    val accessToken: String
)

// -------- RESPONSE MODELS --------
data class LoginResponse(
    val accessToken: String
)

// -------- API INTERFACE --------
interface AuthApi {

    @POST("auth/login")
    suspend fun login(
        @Body request: LoginRequest
    ): LoginResponse

    @POST("auth/register")
    suspend fun register(
        @Body request: RegisterRequest
    ): LoginResponse   // backend returns accessToken

}

