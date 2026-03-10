package com.example.wintensecare.ui.devices

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.example.wintensecare.data.api.ApiClient
import com.example.wintensecare.data.api.CreateDeviceRequest
import com.example.wintensecare.data.api.Device
import com.example.wintensecare.data.api.DeviceApi
import com.example.wintensecare.data.datastore.DeviceStore
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

class DevicesViewModel(application: Application) : AndroidViewModel(application) {

    private val deviceApi =
        ApiClient.retrofit.create(DeviceApi::class.java)

    private val deviceStore = DeviceStore(application.applicationContext)

    private val _devices = MutableStateFlow<List<Device>>(emptyList())
    val devices: StateFlow<List<Device>> = _devices

    private val _selectedDeviceId = MutableStateFlow<String?>(null)
    val selectedDeviceId: StateFlow<String?> = _selectedDeviceId

    init {
        fetchDevices()
        observeSelectedDevice()
    }

    private fun observeSelectedDevice() {
        viewModelScope.launch {
            deviceStore.selectedDeviceFlow.collect {
                _selectedDeviceId.value = it
            }
        }
    }

    fun fetchDevices() {
        viewModelScope.launch {
            _devices.value = deviceApi.getDevices()
        }
    }

    fun addDevice(name: String) {
        viewModelScope.launch {
            deviceApi.createDevice(CreateDeviceRequest(name))
            fetchDevices()
        }
    }

    fun selectDevice(deviceId: String) {
        viewModelScope.launch {
            deviceStore.saveSelectedDevice(deviceId)
        }
    }
}
