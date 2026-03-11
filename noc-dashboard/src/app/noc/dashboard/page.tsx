"use client"

import { useAuth } from "@/hooks/useAuth"

import {
  Box,
  Typography,
  Grid,
  Paper,
  AppBar,
  Toolbar,
  Button,
  Card,
  CardContent
} from "@mui/material"

export default function NocDashboard(){

  const authorized = useAuth("NOC_OPERATOR")

  if(!authorized){
    return <div>Loading...</div>
  }

  return (

    <Box sx={{ background:"#f4f6f8", minHeight:"100vh" }}>

      {/* Header */}
      <AppBar position="static" color="primary">
        <Toolbar sx={{ display:"flex", justifyContent:"space-between" }}>
          <Typography variant="h6">
            NOC Monitoring System
          </Typography>

          <Button color="inherit">
            Logout
          </Button>
        </Toolbar>
      </AppBar>


      <Box sx={{ padding:3 }}>

        {/* Summary Stats */}
        <Grid container spacing={2} mb={3}>

          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6">Total Devices</Typography>
                <Typography variant="h4">120</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6">Online</Typography>
                <Typography variant="h4" color="green">110</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6">Offline</Typography>
                <Typography variant="h4" color="orange">10</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6">Active Alerts</Typography>
                <Typography variant="h4" color="red">4</Typography>
              </CardContent>
            </Card>
          </Grid>

        </Grid>


        {/* Main Layout */}
        <Grid container spacing={2}>

          {/* Patient Grid */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ padding:2 }}>

              <Typography variant="h6" mb={2}>
                Live Patients
              </Typography>

              <Typography color="text.secondary">
                Patient grid will appear here
              </Typography>

            </Paper>
          </Grid>


          {/* Alert Panel */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ padding:2 }}>

              <Typography variant="h6" mb={2}>
                Active Alerts
              </Typography>

              <Typography color="text.secondary">
                Alerts will appear here
              </Typography>

            </Paper>
          </Grid>

        </Grid>

      </Box>

    </Box>

  )
}