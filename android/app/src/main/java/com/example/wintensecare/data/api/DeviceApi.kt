package com.example.wintensecare.data.api

import retrofit2.http.Body
import retrofit2.http.DELETE
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.Path

// -------- MODELS --------
data class Device(
    val id: String,
    val name: String,
    val type: String,
    val createdAt: String
)

data class CreateDeviceRequest(
    val name: String,
    val type: String = "wearable"
)

// -------- API --------
interface DeviceApi {

    @GET("devices")
    suspend fun getDevices(): List<Device>

    @POST("devices")
    suspend fun createDevice(
        @Body request: CreateDeviceRequest
    ): Device

    @DELETE("devices/{id}")
    suspend fun deleteDevice(
        @Path("id") deviceId: String
    )
}
