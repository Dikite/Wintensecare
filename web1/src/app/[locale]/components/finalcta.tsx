"use client";

import React from "react";
import {
  Container,
  Typography,
  Button,
  Stack,
  Link,
  Paper,
  Fade,
  useMediaQuery,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";

/* ---------------- styled layout ---------------- */

const Section = styled("section")(({ theme }) => ({
  position: "relative",
  overflow: "hidden",
  paddingTop: theme.spacing(12),
  paddingBottom: theme.spacing(12),
  background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",

  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    background:
      "linear-gradient(90deg, transparent, rgba(0,0,0,0.1), transparent)",
  },

  [theme.breakpoints.down("md")]: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
}));

const DecorCircle = styled("div")<{
  size: number;
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
  opacity: number;
}>(({ size, top, right, bottom, left, opacity }) => ({
  position: "absolute",
  width: size,
  height: size,
  borderRadius: "50%",
  top,
  right,
  bottom,
  left,
  opacity,
  background:
    "linear-gradient(45deg, rgba(0,0,0,0.02), rgba(0,0,0,0.05))",
}));

const Card = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(6),
  background:
    "linear-gradient(145deg, rgba(255,255,255,0.9), rgba(248,249,250,0.9))",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(255,255,255,0.8)",
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow:
    "0 20px 40px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.1)",
  position: "relative",
  zIndex: 1,

  [theme.breakpoints.down("md")]: {
    padding: theme.spacing(4),
  },
}));

/* ---------------- component ---------------- */

const FinalCTA = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Fade in timeout={1000}>
      <Section>
        {/* Decorative circles */}
        <DecorCircle size={300} top={-100} right={-100} opacity={0.6} />
        <DecorCircle size={200} bottom={-50} left={-50} opacity={0.4} />

        <Container maxWidth="lg">
          <Card elevation={0}>
            <Container maxWidth="md">
              {/* Headline */}
              <Typography
                variant={isMobile ? "h4" : "h3"}
                fontWeight={700}
                gutterBottom
                sx={{
                  background:
                    "linear-gradient(135deg, #2c3e50, #34495e)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  letterSpacing: "-0.5px",
                  lineHeight: 1.2,
                }}
              >
                Ready to Bring Peace of Mind to Your World?
              </Typography>

              {/* Subtext */}
              <Typography
                variant={isMobile ? "body1" : "h6"}
                sx={{
                  mb: 4,
                  color: "text.secondary",
                  lineHeight: 1.6,
                  maxWidth: 600,
                  margin: "0 auto",
                  opacity: 0.8,
                }}
              >
                Join thousands of families and professionals who trust us to
                keep their loved ones safe, healthy, and connected.
              </Typography>

              {/* CTA Buttons */}
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={3}
                justifyContent="center"
                alignItems="center"
                mb={3}
              >
                <Button
                  variant="contained"
                  size="large"
                  href="#get-started"
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontSize: "1.1rem",
                    fontWeight: 600,
                    borderRadius: 3,
                    minWidth: 200,
                    background:
                      "linear-gradient(135deg, #667eea, #764ba2)",
                    boxShadow:
                      "0 4px 15px rgba(102,126,234,0.3)",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow:
                        "0 8px 25px rgba(102,126,234,0.4)",
                    },
                  }}
                >
                  Get Started Today
                </Button>

                <Button
                  variant="outlined"
                  size="large"
                  href="#pricing"
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontSize: "1.1rem",
                    fontWeight: 600,
                    borderRadius: 3,
                    minWidth: 200,
                    borderWidth: 2,
                    "&:hover": {
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  View Pricing
                </Button>
              </Stack>

              {/* Links */}
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                justifyContent="center"
                alignItems="center"
                mt={2}
              >
                <Link
                  href="#contact-sales"
                  underline="none"
                  sx={{ color: "text.secondary", fontWeight: 500 }}
                >
                  Contact Sales for Enterprises
                </Link>

                {!isMobile && (
                  <span
                    style={{
                      width: 4,
                      height: 4,
                      borderRadius: "50%",
                      background: theme.palette.text.secondary,
                      opacity: 0.5,
                    }}
                  />
                )}

                <Link
                  href="#demo"
                  underline="none"
                  sx={{ color: "text.secondary", fontWeight: 500 }}
                >
                  Schedule a Demo
                </Link>
              </Stack>

              {/* Trust */}
              <Typography
                variant="caption"
                display="block"
                align="center"
                mt={4}
                sx={{ opacity: 0.7 }}
              >
                Trusted by 10,000+ families worldwide
              </Typography>
            </Container>
          </Card>
        </Container>
      </Section>
    </Fade>
  );
};

export default FinalCTA;
