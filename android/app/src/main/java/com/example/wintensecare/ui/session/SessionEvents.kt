package com.example.wintensecare.ui.session

import kotlinx.coroutines.flow.MutableSharedFlow
import kotlinx.coroutines.flow.asSharedFlow

object SessionEvents {
    private val _logout = MutableSharedFlow<Unit>()
    val logout = _logout.asSharedFlow()

    suspend fun emitLogout() {
        _logout.emit(Unit)
    }
}
