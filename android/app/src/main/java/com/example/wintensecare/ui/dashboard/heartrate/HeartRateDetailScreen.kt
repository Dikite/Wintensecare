package com.example.wintensecare.ui.dashboard.heartrate

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.wintensecare.data.api.TelemetryRange
import com.example.wintensecare.ui.heartrate.HeartRateViewModel
import com.example.wintensecare.ui.heartrate.InteractiveLineChart

@Composable
fun HeartRateDetailScreen(
    deviceId: String,
    onBack: () -> Unit,
    viewModel: HeartRateViewModel = viewModel()
) {
    val range by viewModel.range.collectAsState()
    val state by viewModel.state.collectAsState()

    LaunchedEffect(range) {
        viewModel.load(deviceId)
    }

    val current = state.points.lastOrNull() ?: 0

    val zone = when {
        current >= 200 -> "CRITICAL"
        current >= 170 -> "WARNING"
        else -> "NORMAL"
    }

    val zoneColor = when {
        current >= 200 -> Color.Red
        current >= 170 -> Color(0xFFFF9800)
        else -> Color(0xFF4CAF50)
    }

    Column(Modifier.fillMaxSize().padding(16.dp)) {

        Text("Heart Rate", style = MaterialTheme.typography.headlineMedium)

        Spacer(Modifier.height(12.dp))

        // 🔥 CURRENT HEART RATE
        Text(
            text = "$current bpm",
            style = MaterialTheme.typography.displayLarge,
            color = zoneColor
        )
        Text(
            text = "Current – $zone",
            color = zoneColor
        )

        Spacer(Modifier.height(16.dp))

        // 🔥 SUMMARY BAR
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceEvenly
        ) {
            StatBox("AVG", state.avg)
            StatBox("MIN", state.min)
            StatBox("MAX", state.max)
        }

        Spacer(Modifier.height(16.dp))

        // 🔥 RANGE SELECTOR (only backend-valid values)
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            listOf(
                TelemetryRange.M30,
                TelemetryRange.H1,
                TelemetryRange.H8,
                TelemetryRange.D1,
                TelemetryRange.W1
            ).forEach {
                FilterChip(
                    selected = range == it,
                    onClick = { viewModel.setRange(it) },
                    label = { Text(it.label.uppercase()) }
                )
            }
        }

        Spacer(Modifier.height(16.dp))

        // 🔥 MEDICAL GRAPH
        InteractiveLineChart(
            values = state.points,
            labels = state.labels
        )

        Spacer(Modifier.weight(1f))

        Button(onClick = onBack, modifier = Modifier.fillMaxWidth()) {
            Text("Back")
        }
    }
}

@Composable
private fun StatBox(label: String, value: Int) {
    Column(horizontalAlignment = Alignment.CenterHorizontally) {
        Text(label, style = MaterialTheme.typography.labelSmall)
        Text(value.toString(), style = MaterialTheme.typography.titleLarge)
    }
}
