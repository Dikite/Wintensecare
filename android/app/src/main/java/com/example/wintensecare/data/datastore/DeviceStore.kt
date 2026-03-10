package com.example.wintensecare.data.datastore

import android.content.Context
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map

private val Context.deviceDataStore by preferencesDataStore(name = "device_prefs")

class DeviceStore(private val context: Context) {

    companion object {
        private val DEVICE_ID_KEY = stringPreferencesKey("selected_device_id")
    }

    suspend fun saveSelectedDevice(deviceId: String) {
        context.deviceDataStore.edit { prefs ->
            prefs[DEVICE_ID_KEY] = deviceId
        }
    }

    val selectedDeviceFlow: Flow<String?> =
        context.deviceDataStore.data.map { prefs ->
            prefs[DEVICE_ID_KEY]
        }

    suspend fun clearSelectedDevice() {
        context.deviceDataStore.edit { prefs ->
            prefs.remove(DEVICE_ID_KEY)
        }
    }
}
