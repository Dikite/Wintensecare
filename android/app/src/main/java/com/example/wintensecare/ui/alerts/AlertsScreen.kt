package com.example.wintensecare.ui.alerts

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
fun AlertsScreen(
    onBack: () -> Unit,
    viewModel: AlertsViewModel = viewModel()
) {
    val alerts by viewModel.alerts.collectAsState()

    LaunchedEffect(Unit) {
        viewModel.loadAlerts()
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
    ) {

        Text(
            text = "Alerts",
            style = MaterialTheme.typography.headlineMedium
        )

        Spacer(Modifier.height(12.dp))

        LazyColumn(
            modifier = Modifier.weight(1f)
        ) {
            items(alerts) { alert ->

                val color =
                    when (alert.severity) {
                        "CRITICAL" -> Color.Red
                        "WARNING" -> Color(0xFFFF9800)
                        else -> Color.Gray
                    }

                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 6.dp),
                    colors = CardDefaults.cardColors(
                        containerColor = color.copy(alpha = 0.15f)
                    )
                ) {
                    Column(Modifier.padding(12.dp)) {

                        Text(
                            text = alert.message,
                            color = color,
                            style = MaterialTheme.typography.titleMedium
                        )

                        Spacer(Modifier.height(4.dp))

                        Text("Metric: ${alert.metric}")
                        Text("Value: ${alert.value}")

                        if (!alert.acknowledged) {
                            Spacer(Modifier.height(8.dp))
                            Button(
                                onClick = {
                                    viewModel.acknowledge(alert.id)
                                }
                            ) {
                                Text("Acknowledge")
                            }
                        } else {
                            Spacer(Modifier.height(8.dp))
                            Text(
                                text = "Acknowledged ✔",
                                color = Color.Green
                            )
                        }
                    }
                }
            }
        }

        Spacer(Modifier.height(12.dp))

        Button(
            onClick = onBack,
            modifier = Modifier.fillMaxWidth()
        ) {
            Text("Back")
        }
    }
}
