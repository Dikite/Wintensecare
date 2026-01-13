package com.example.wintensecare.ui.dashboard

import android.os.Build
import androidx.annotation.RequiresApi
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import java.time.OffsetDateTime
import java.time.ZoneOffset

@RequiresApi(Build.VERSION_CODES.O)
@Composable
fun DashboardScreen(
    deviceId: String,
    onOpenHeartRate: () -> Unit,
    onOpenSteps: () -> Unit,
    onViewAlerts: () -> Unit,
    onChangeDevice: () -> Unit,
    onLogout: () -> Unit,
    viewModel: DashboardViewModel = viewModel()
) {
    val state by viewModel.uiState.collectAsState()

    LaunchedEffect(deviceId) {
        while (true) {
            viewModel.loadTelemetry(deviceId)
            kotlinx.coroutines.delay(30_000)
        }
    }


    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(20.dp)
    ) {

        item {
            Text(
                text = "Dashboard",
                style = MaterialTheme.typography.headlineMedium
            )
        }

        when (state) {

            DashboardUiState.Loading -> item {
                Box(
                    modifier = Modifier.fillMaxWidth(),
                    contentAlignment = Alignment.Center
                ) {
                    CircularProgressIndicator()
                }
            }

            is DashboardUiState.Error -> item {
                Text(
                    text = (state as DashboardUiState.Error).message,
                    color = MaterialTheme.colorScheme.error
                )
            }

            is DashboardUiState.Success -> {

                val success = state as DashboardUiState.Success

                val statusColor =
                    when (success.status) {
                        DashboardStatus.CRITICAL -> Color.Red
                        DashboardStatus.WARNING,
                        DashboardStatus.LOW_BATTERY -> Color(0xFFFF9800)
                        DashboardStatus.NORMAL -> Color(0xFF4CAF50)
                    }

                // STATUS CARD (PRIMARY)
                item {
                    val minutesAgo =
                        java.time.Duration
                            .between(success.lastUpdated, OffsetDateTime.now(ZoneOffset.UTC))
                            .toMinutes()

                    Text(
                        text = "Updated ${minutesAgo} min ago",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )

                    Card(
                        colors = CardDefaults.cardColors(
                            containerColor = statusColor.copy(alpha = 0.12f)
                        )
                    ) {
                        Column(Modifier.padding(16.dp)) {
                            Text(
                                text = "Status: ${success.status.name.replace("_", " ")}",
                                color = statusColor,
                                style = MaterialTheme.typography.titleMedium
                            )

                            Spacer(Modifier.height(8.dp))

                            Button(
                                onClick = onViewAlerts,
                                modifier = Modifier.fillMaxWidth()
                            ) {
                                Text("View Alerts")
                            }
                        }
                    }
                }

                // METRICS (SECONDARY)
                item {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(12.dp)
                    ) {

                        SummaryCard(
                            title = "Heart Rate",
                            value = success.latestHeartRate.toString(),
                            unit = "bpm",
                            modifier = Modifier
                                .weight(1f)
                                .clickable { onOpenHeartRate() }
                        )

                        SummaryCard(
                            title = "Steps Today",
                            value = success.todaySteps.toString(),
                            unit = "",
                            modifier = Modifier
                                .weight(1f)
                                .clickable { onOpenSteps() }
                        )

                        SummaryCard(
                            title = "Battery",
                            value = "${success.battery}%",
                            unit = "",
                            modifier = Modifier.weight(1f)
                        )
                    }
                }
            }
        }

        // ACTIONS (TERTIARY)
        item {
            Button(
                onClick = onChangeDevice,
                modifier = Modifier.fillMaxWidth()
            ) {
                Text("Change Device")
            }
        }

        item {
            OutlinedButton(
                onClick = onLogout,
                modifier = Modifier.fillMaxWidth()
            ) {
                Text("Logout")
            }
        }
    }
}
