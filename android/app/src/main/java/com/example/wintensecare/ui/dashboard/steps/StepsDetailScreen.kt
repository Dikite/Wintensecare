package com.example.wintensecare.ui.steps

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.wintensecare.data.api.TelemetryRange

@Composable
fun StepsDetailScreen(
    deviceId: String,
    onBack: () -> Unit,
    viewModel: StepsViewModel = viewModel()
) {
    val range by viewModel.range.collectAsState()
    val state by viewModel.uiState.collectAsState()

    LaunchedEffect(range) {
        viewModel.load(deviceId)
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
    ) {

        Text(
            text = "Steps",
            style = MaterialTheme.typography.headlineMedium
        )

        Spacer(Modifier.height(16.dp))

        /* ---------- RANGE SELECTOR ---------- */
        Row(
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
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
                    label = { Text(it.label) }
                )
            }
        }

        Spacer(Modifier.height(32.dp))

        when (state) {

            StepsUiState.Loading -> {
                Box(
                    modifier = Modifier.fillMaxWidth(),
                    contentAlignment = Alignment.Center
                ) {
                    CircularProgressIndicator()
                }
            }

            is StepsUiState.Error -> {
                Text(
                    text = (state as StepsUiState.Error).message,
                    color = MaterialTheme.colorScheme.error
                )
            }

            is StepsUiState.Success -> {
                val steps =
                    (state as StepsUiState.Success).totalSteps

                Box(
                    modifier = Modifier.fillMaxWidth(),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = steps.toString(),
                        style = MaterialTheme.typography.displayLarge
                    )
                }

                Spacer(Modifier.height(8.dp))

                Text(
                    text = "Total steps (${range.label})",
                    modifier = Modifier.align(Alignment.CenterHorizontally),
                    style = MaterialTheme.typography.bodyMedium
                )
            }
        }

        Spacer(Modifier.weight(1f))

        Button(
            onClick = onBack,
            modifier = Modifier.fillMaxWidth()
        ) {
            Text("Back")
        }
    }
}
