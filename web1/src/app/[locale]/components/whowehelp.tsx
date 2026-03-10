"use client";
import React, { useState, useEffect } from "react";
import { Box, Typography, IconButton, useTheme, useMediaQuery } from "@mui/material";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import Image from "next/image";



import Head from "next/head";

type Slide = {
  image: string;
  title: string;
  subtitle: string;
  description: string;
};

const slides: Slide[] = [
  {
    image: "/images/family.png",
    title: "For Families",
    subtitle: "",
    description:
      "Get peace of mind with real-time alerts on the health and well-being of your parents, children, and loved ones, no matter the distance.",
  },
  {
    image: "/images/employee.png",
    title: "For Employee Wellness",
    subtitle: "",
    description:
      "Proactively support your team's health with our corporate wellness platform, leading to a happier, healthier, and more productive workplace.",
  },
  {
    image: "/images/public.png",
    title: "For Public Health",
    subtitle: "",
    description:
      "Scalable technology for government-supported health initiatives, enabling wider community care and preventative wellness programs.",
  },
  {
    image: "/images/providers.png",
    title: "For Healthcare Providers",
    subtitle: "",
    description:
      "Seamlessly integrate patient-generated health data into clinical workflows for better remote patient monitoring and informed consultations.",
  },
];

const AutoSlider: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [current, setCurrent] = useState(0);

  // Auto-slide every 6s
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 9000);
    return () => clearInterval(interval);
  }, []);

  const handleNext = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const slide = slides[current];

  return (
    <>
      <Head>
        <title>Who We Help | Health Monitoring Solutions</title>
        <meta
          name="description"
          content="Discover how our health monitoring solutions help families, businesses, healthcare providers, and public health initiatives."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #1a365d 0%, #2d3748 50%, #4a5568 100%)',
          pt: { xs: 10, md: 12 },
          pb: { xs: 6, md: 8 },
          px: { xs: 2, sm: 4 },
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.1) 0%, transparent 50%)',
            zIndex: 0,
          }
        }}
      >
        <Box sx={{ 
          textAlign: 'center', 
          mb: { xs: 6, md: 8 },
          position: 'relative',
          zIndex: 1 
        }}>
          <Typography
            variant={isMobile ? 'h3' : 'h2'}
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 800,
              color: 'white',
              fontSize: { xs: '2.25rem', sm: '3rem', md: '4rem' },
              mb: 2,
              textShadow: '0 4px 8px rgba(0,0,0,0.3)',
              background: 'linear-gradient(45deg, #ffffff 30%, #e2e8f0 90%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.02em',
            }}
          >
            Who We Help
          </Typography>
          <Box
            sx={{
              width: '100px',
              height: '4px',
              background: 'linear-gradient(90deg, #4299e1, #38b2ac)',
              margin: '0 auto',
              borderRadius: '2px',
              boxShadow: '0 2px 8px rgba(66, 153, 225, 0.5)',
            }}
          />
        </Box>

        {/* Hero Section: Image left, Text right */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            mb: 8,
            position: 'relative',
            zIndex: 1,
          }}
        >
          {/* Image */}
          <Box
            sx={{
              position: 'relative',
              width: { xs: '100%', md: '50%' },
              height: { xs: 250, md: 400 },
              flexShrink: 0,
              borderRadius: 4,
              overflow: 'hidden',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
              border: '1px solid rgba(255,255,255,0.1)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 35px 60px -12px rgba(0,0,0,0.35)',
              }
            }}
          >
          <img
  src="/images/who-we-help-header.png"
  alt="Health Monitoring Solutions - Supporting Families, Businesses, Healthcare Providers and Public Health"
  style={{ width: "100%", height: "100%", objectFit: "cover" }}
/>

          </Box>
          
          
          <Box sx={{ maxWidth: '600px' }}>
            <Typography
              variant={isMobile ? 'h6' : 'h5'}
              component="p"
              sx={{
                color: 'white',
                fontWeight: 600,
                fontSize: { xs: '1.125rem', md: '1.5rem' },
                lineHeight: 1.4,
                textAlign: { xs: 'center', md: 'left' },
                mb: 2,
                textShadow: '0 2px 4px rgba(0,0,0,0.2)',
              }}
            >
              A Unified Vision for Health and Wellness
            </Typography>
            <Typography
              variant={isMobile ? 'body1' : 'h6'}
              component="p"
              sx={{
                color: 'rgba(255, 255, 255, 0.95)',
                fontSize: { xs: '1rem', md: '1.125rem' },
                lineHeight: 1.7,
                textAlign: { xs: 'center', md: 'left' },
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                padding: 3,
                borderRadius: 3,
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              Our comprehensive health monitoring solutions are designed to support various sectors in achieving better health outcomes and peace of mind. From bustling corporate offices to dedicated healthcare facilities and vibrant community centers, our technology bridges the gap between patient and provider.
            </Typography>
          </Box>
        </Box>

        {/* Slider Section */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
            position: 'relative',
            maxWidth: '1400px',
            margin: '0 auto',
            width: '90%',
            zIndex: 1,
          }}
        >
          {/* Left Image */}
          <Box
            sx={{
              flex: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              p: 3,
            }}
          >
            <Box
              sx={{
                position: 'relative',
                width: { xs: 350, md: 600 },
                height: { xs: 220, md: 360 },
                borderRadius: 3,
                overflow: "hidden",
                boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                border: '1px solid rgba(255,255,255,0.15)',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.02)',
                }
              }}
            >
             <img
  src={slide.image}
  alt={slide.title}
  style={{ width: "100%", height: "100%", objectFit: "cover" }}
/>

            </Box>
          </Box>

          {/* Right Text with slide animation */}
          <Box
            key={current}
            sx={{
              flex: 1,
              p: 3,
              textAlign: { xs: "center", md: "left" },
              animation: "fadeInUp 0.8s ease-out",
              "@keyframes fadeInUp": {
                from: { 
                  opacity: 0, 
                  transform: "translateY(30px) translateX(20px)" 
                },
                to: { 
                  opacity: 1, 
                  transform: "translateY(0) translateX(0)" 
                },
              },
            }}
          >
            <Typography 
              variant="h5" 
              sx={{ 
                color: '#4299e1',
                fontWeight: 700,
                mb: 1,
                fontSize: { xs: '1.25rem', md: '1.5rem' },
                textShadow: '0 2px 4px rgba(0,0,0,0.1)',
              }} 
              gutterBottom
            >
              {slide.title}
            </Typography>
            {slide.subtitle && (
              <Typography 
                variant="h3" 
                fontWeight="bold" 
                sx={{ 
                  color: 'white', 
                  mb: 3,
                  fontSize: { xs: '2rem', md: '2.5rem' },
                  background: 'linear-gradient(45deg, #ffffff 30%, #e2e8f0 90%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }} 
                gutterBottom
              >
                {slide.subtitle}
              </Typography>
            )}
            <Typography 
              variant="body1" 
              sx={{ 
                color: 'rgba(255, 255, 255, 0.95)',
                fontSize: { xs: '1rem', md: '1.125rem' },
                lineHeight: 1.8,
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(8px)',
                padding: 3,
                borderRadius: 2,
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }} 
              paragraph
            >
              {slide.description}
            </Typography>
          </Box>

          {/* Left/Right Arrows */}
          <IconButton
            onClick={handlePrev}
            sx={{
              position: "absolute",
              left: { md: -60 },
              top: "50%",
              transform: "translateY(-50%)",
              bgcolor: "rgba(255, 255, 255, 0.95)",
              color: '#2d3748',
              width: 56,
              height: 56,
              "&:hover": { 
                bgcolor: "white",
                transform: "translateY(-50%) scale(1.1)",
                boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
              },
              display: { xs: 'none', md: 'flex' },
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
            }}
          >
            <ArrowBackIos />
          </IconButton>

          <IconButton
            onClick={handleNext}
            sx={{
              position: "absolute",
              right: { md: -60 },
              top: "50%",
              transform: "translateY(-50%)",
              bgcolor: "rgba(255, 255, 255, 0.95)",
              color: '#2d3748',
              width: 56,
              height: 56,
              "&:hover": { 
                bgcolor: "white",
                transform: "translateY(-50%) scale(1.1)",
                boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
              },
              display: { xs: 'none', md: 'flex' },
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
            }}
          >
            <ArrowForwardIos />
          </IconButton>

          {/* Dots Indicator */}
          <Box
            sx={{
              position: "absolute",
              bottom: -40,
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              gap: 2,
            }}
          >
            {slides.map((_, index) => (
              <Box
                key={index}
                onClick={() => setCurrent(index)}
                sx={{
                  width: current === index ? 24 : 12,
                  height: 12,
                  borderRadius: 6,
                  bgcolor: current === index ? "#4299e1" : "rgba(255,255,255,0.4)",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  boxShadow: current === index ? '0 2px 8px rgba(66, 153, 225, 0.6)' : 'none',
                  '&:hover': {
                    bgcolor: current === index ? "#3182ce" : "rgba(255,255,255,0.6)",
                    transform: 'scale(1.2)',
                  }
                }}
              />
            ))}
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default AutoSlider;