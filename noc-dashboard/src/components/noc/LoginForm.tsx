"use client"

import { useState } from "react"
import { useLogin } from "@/hooks/useLogin"

import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  InputAdornment
} from "@mui/material"

import EmailIcon from "@mui/icons-material/Email"
import LockIcon from "@mui/icons-material/Lock"
import MonitorHeartIcon from "@mui/icons-material/MonitorHeart"

export default function LoginForm() {

  const { login } = useLogin()

  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const [loading,setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setLoading(true)

    try{
      await login(email,password)
    }finally{
      setLoading(false)
    }
  }

  return (

    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:"#f4f6f8"
      }}
    >

      <Container maxWidth="sm">

        <Paper
          elevation={6}
          sx={{
            padding: 5
          }}
        >

          <Box textAlign="center" mb={3}>

            <MonitorHeartIcon
              sx={{
                fontSize:48,
                color:"#0ea5e9",
                mb:1
              }}
            />

            <Typography variant="h4" fontWeight={600}>
              NOC Monitoring System
            </Typography>

            <Typography color="text.secondary">
              Operator Login
            </Typography>

          </Box>

          <Box
            component="form"
            onSubmit={handleSubmit}
            display="flex"
            flexDirection="column"
            gap={2}
          >

            <TextField
              label="Email"
              fullWidth
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              InputProps={{
                startAdornment:(
                  <InputAdornment position="start">
                    <EmailIcon/>
                  </InputAdornment>
                )
              }}
            />

            <TextField
              label="Password"
              type="password"
              fullWidth
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              InputProps={{
                startAdornment:(
                  <InputAdornment position="start">
                    <LockIcon/>
                  </InputAdornment>
                )
              }}
            />

            <Button
              variant="contained"
              size="large"
              type="submit"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>

          </Box>

        </Paper>

      </Container>

    </Box>
  )
}