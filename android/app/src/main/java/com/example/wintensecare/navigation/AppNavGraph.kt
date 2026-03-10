package com.example.wintensecare.navigation

import android.os.Build
import androidx.annotation.RequiresApi
import androidx.compose.runtime.*
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import com.example.wintensecare.ui.alerts.AlertsScreen
import com.example.wintensecare.ui.dashboard.DashboardScreen
import com.example.wintensecare.ui.devices.DevicesScreen
import com.example.wintensecare.ui.dashboard.heartrate.HeartRateDetailScreen
import com.example.wintensecare.ui.login.LoginScreen
import com.example.wintensecare.ui.register.RegisterScreen
import com.example.wintensecare.ui.session.LoadingScreen
import com.example.wintensecare.ui.session.SessionState
import com.example.wintensecare.ui.session.SessionViewModel
import com.example.wintensecare.ui.steps.StepsDetailScreen

@RequiresApi(Build.VERSION_CODES.O)
@Composable
fun AppNavGraph(navController: NavHostController) {

    val sessionViewModel: SessionViewModel = viewModel()
    val sessionState by sessionViewModel.sessionState.collectAsState()

    when (sessionState) {

        SessionState.Loading -> {
            LoadingScreen()
        }

        SessionState.LoggedOut -> {
            NavHost(
                navController = navController,
                startDestination = Routes.LOGIN
            ) {

                composable(Routes.LOGIN) {
                    LoginScreen(
                        onLoginSuccess = { /* DO NOTHING */ },
                        onGoToRegister = {
                            navController.navigate(Routes.REGISTER)
                        }
                    )
                }
                composable(Routes.REGISTER) {
                    RegisterScreen(
                        onSuccess = {
                            navController.popBackStack()   // go back to Login
                        }
                    )

                }
            }
        }

        SessionState.LoggedInNoDevice -> {
            NavHost(
                navController = navController,
                startDestination = Routes.DEVICES
            ) {
                composable(Routes.DEVICES) {
                    DevicesScreen { deviceId ->
                        sessionViewModel.setSelectedDevice(deviceId)
                    }
                }
            }
        }

        is SessionState.LoggedInWithDevice -> {
            val deviceId =
                (sessionState as SessionState.LoggedInWithDevice).deviceId

            NavHost(
                navController = navController,
                startDestination = Routes.DASHBOARD
            ) {

                composable(Routes.DASHBOARD) {
                    DashboardScreen(
                        deviceId = deviceId,
                        onOpenHeartRate = {
                            navController.navigate(Routes.HEART_RATE)
                        },
                        onOpenSteps = {
                            navController.navigate(Routes.STEPS)
                        },
                        onViewAlerts = {
                            navController.navigate(Routes.ALERTS)
                        },
                        onChangeDevice = {
                            sessionViewModel.clearSelectedDevice()
                        },
                        onLogout = {
                            sessionViewModel.logout()
                        }
                    )
                }

                composable(Routes.HEART_RATE) {
                    HeartRateDetailScreen(
                        deviceId = deviceId,
                        onBack = { navController.popBackStack() }
                    )
                }

                composable(Routes.STEPS) {
                    StepsDetailScreen(
                        deviceId = deviceId,
                        onBack = { navController.popBackStack() }
                    )
                }

                composable(Routes.ALERTS) {
                    AlertsScreen(
                        onBack = { navController.popBackStack() }
                    )
                }
            }
        }
    }
}
