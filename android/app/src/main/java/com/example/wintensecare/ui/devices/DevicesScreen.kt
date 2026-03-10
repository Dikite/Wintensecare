package com.example.wintensecare.ui.devices

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel


@Composable
fun DevicesScreen(
    onDeviceSelected: (String) -> Unit
) {
    val viewModel: DevicesViewModel = viewModel()
    val devices by viewModel.devices.collectAsState()
    val selectedDeviceId by viewModel.selectedDeviceId.collectAsState()

    var newDeviceName by remember { mutableStateOf("") }

    Column(
        Modifier
            .fillMaxSize()
            .padding(16.dp)
    ) {

        Text("Select Device", style = MaterialTheme.typography.headlineSmall)

        Spacer(Modifier.height(12.dp))

        OutlinedTextField(
            value = newDeviceName,
            onValueChange = { newDeviceName = it },
            label = { Text("Device name") },
            modifier = Modifier.fillMaxWidth()
        )

        Button(
            onClick = {
                if (newDeviceName.isNotBlank()) {
                    viewModel.addDevice(newDeviceName)
                    newDeviceName = ""
                }
            },
            modifier = Modifier.fillMaxWidth()
        ) {
            Text("Add Device")
        }

        Spacer(Modifier.height(16.dp))

        LazyColumn {
            items(devices) { device ->
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 4.dp)
                        .clickable {
                            viewModel.selectDevice(device.id)
                            onDeviceSelected(device.id) // ✅ PASS ID UP
                        },
                    colors = CardDefaults.cardColors(
                        containerColor =
                            if (device.id == selectedDeviceId)
                                Color(0xFFE0F2F1)
                            else
                                MaterialTheme.colorScheme.surface
                    )
                ) {
                    Column(Modifier.padding(16.dp)) {
                        Text(device.name)
                        Text(
                            device.type,
                            style = MaterialTheme.typography.bodySmall
                        )
                    }
                }
            }
        }
    }
}
