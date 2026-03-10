package com.example.wintensecare.ui.heartrate

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.gestures.detectTapGestures
import androidx.compose.foundation.layout.*
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.unit.dp

@Composable
fun InteractiveLineChart(
    values: List<Int>,
    labels: List<String>
) {
    if (values.size < 2) return

    var selected by remember { mutableStateOf<Int?>(null) }

    Box {

        Canvas(
            modifier = Modifier
                .fillMaxWidth()
                .height(220.dp)
                .pointerInput(values) {
                    detectTapGestures { pos ->
                        val index =
                            ((pos.x / size.width) * values.size)
                                .toInt()
                                .coerceIn(0, values.lastIndex)
                        selected = index
                    }
                }
        ) {

            val max = values.maxOrNull() ?: return@Canvas
            val min = values.minOrNull() ?: return@Canvas
            val range = (max - min).coerceAtLeast(1)

            val stepX = size.width / (values.size - 1)

            val path = Path()

            values.forEachIndexed { i, v ->
                val x = stepX * i
                val y = size.height - ((v - min) / range.toFloat()) * size.height

                if (i == 0) path.moveTo(x, y)
                else path.lineTo(x, y)
            }

            val color =
                when {
                    max >= 200 -> Color.Red
                    max >= 170 -> Color(0xFFFF9800)
                    else -> Color(0xFF4CAF50)
                }

            drawPath(path, color, style = Stroke(width = 4.dp.toPx()))

            selected?.let {
                val x = stepX * it
                drawLine(
                    Color.Gray,
                    start = Offset(x, 0f),
                    end = Offset(x, size.height),
                    strokeWidth = 2.dp.toPx()
                )
            }
        }

        selected?.let { i ->
            Column(
                modifier = Modifier.padding(8.dp)
            ) {
                Text("${values[i]} bpm")
                Text(labels[i])
            }
        }
    }
}
