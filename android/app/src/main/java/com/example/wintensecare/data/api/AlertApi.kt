package com.example.wintensecare.data.api

import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.Path

data class Alert(
    val id: String,
    val deviceId: String,
    val metric: String,
    val value: Int,
    val severity: String,
    val message: String,
    val acknowledged: Boolean,
    val createdAt: String
)

interface AlertApi {

    @GET("alerts")
    suspend fun getAlerts(): List<Alert>

    @POST("alerts/{id}/ack")
    suspend fun acknowledgeAlert(
        @Path("id") alertId: String
    )
}
