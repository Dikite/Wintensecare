'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  IconButton,
  Chip,
  Button,
  Fade,
} from '@mui/material';
import {
  ArrowBackIos,
  ArrowForwardIos,
  Notifications,
  Favorite,
  FitnessCenter,
  LocationOn,
  Smartphone,
} from '@mui/icons-material';

interface Feature {
  icon: React.ReactElement;
  title: string;
  description: string;
  isCore?: boolean;
}

interface CarouselImage {
  src: string;
  alt: string;
  description: string;
}

const TechnologyOfCareSection: React.FC = () => {
  const theme = useTheme();
 
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const features: Feature[] = [
    {
      icon: <Notifications sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      title: 'Real-Time Health Alerts',
      description: 'Our core feature. Get instant notifications for abnormal heart rate patterns, allowing for prompt action.',
      isCore: true,
    },
    {
      icon: <Favorite sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      title: '24/7 Heart Rate Monitoring',
      description: 'Continuous, medical-grade tracking provides a comprehensive picture of heart health, day and night.',
    },
    {
      icon: <FitnessCenter sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      title: 'Activity & Sleep Tracking',
      description: 'Monitor steps, calories, and sleep stages to promote overall well-being and healthy habits.',
    },
    {
      icon: <LocationOn sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      title: 'GPS & Safety Features',
      description: 'Optional fall detection and location tracking for added security, especially for elderly users.',
    },
    {
      icon: <Smartphone sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      title: 'Seamless App Connectivity',
      description: 'Sync all data to a user-friendly app. Share insights with family, your workplace wellness program, or your doctor with just a few taps.',
    },
  ];

  const carouselImages: CarouselImage[] = [
    {
      src: '/images/watch-wrist.png',
      alt: 'Smartwatch on wrist',
      description: 'Elegant design meets advanced health monitoring',
    },
    {
      src: '/images/heartrate.png',
      alt: 'Heart rate graph on watch face',
      description: 'Real-time heart rate monitoring with detailed analytics',
    },
    {
      src: '/images/app-dashboard.png',
      alt: 'Mobile app dashboard',
      description: 'Comprehensive health insights in our mobile application',
    },
  ];

  // Memoized navigation functions
  const nextImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev + 1) % carouselImages.length);
  }, [carouselImages.length]);

  const prevImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
  }, [carouselImages.length]);

  // Auto-play with pause on hover/interaction
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      nextImage();
    }, 3000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, nextImage]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') prevImage();
      if (event.key === 'ArrowRight') nextImage();
      if (event.key === ' ') {
        event.preventDefault();
        setIsAutoPlaying(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prevImage, nextImage]);

  // Handle image loading errors
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

  const handleImageError = (index: number) => {
    setImageErrors(prev => ({ ...prev, [index]: true }));
  };

  return (
    <Box
      sx={{
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        py: { xs: 6, md: 8 },
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
      }}
    >
      <Container maxWidth="lg">
        {/* Section Title */}
        <Box textAlign="center" mb={{ xs: 4, md: 6 }}>
          <Typography
            variant="h2"
            component="h2"
            gutterBottom
            sx={{
              fontWeight: 700,
              background: 'linear-gradient(45deg, #2c3e50, #3498db)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3.5rem' },
              lineHeight: 1.2,
            }}
          >
            The Technology of Care
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{
              maxWidth: '600px',
              margin: '0 auto',
              fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' },
              lineHeight: 1.5,
            }}
          >
            Advanced health monitoring technology designed for your peace of mind
          </Typography>
        </Box>

        {/* Content Layout */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: { xs: 3, md: 4 },
            alignItems: 'flex-start',
          }}
        >
    {/* Features List - Left Side */}
<Box sx={{ width: { xs: '100%', md: '50%' } }}>
  {features.map((feature, index) => (
    <Fade in key={index} timeout={600} style={{ transitionDelay: `${index * 150}ms` }}>
      <Card
        sx={{
          mb: 3,
          borderRadius: 4,
          boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
          border: '1px solid rgba(255,255,255,0.3)',
          backdropFilter: 'blur(12px)',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
          transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '4px',
            height: '100%',
            background: feature.isCore 
              ? 'linear-gradient(45deg, #FF6B6B, #4ECDC4)'
              : 'linear-gradient(45deg, #3498db, #2c3e50)',
            transition: 'width 0.3s ease',
          },
          '&:hover': {
            transform: 'translateY(-6px) scale(1.02)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
            '&::before': {
              width: '8px',
            },
            '& .feature-icon': {
              transform: 'scale(1.1) rotate(5deg)',
              background: 'linear-gradient(45deg, #3498db, #2c3e50)',
              '& svg': {
                color: 'white !important',
              },
            },
          },
        }}
      >
        <CardContent sx={{ p: { xs: 2.5, sm: 3.5 }, pl: { xs: 3.5, sm: 4 } }}>
          <Box display="flex" alignItems="flex-start" gap={3}>
            <Box 
              className="feature-icon"
              sx={{
                minWidth: { xs: 60, sm: 70 },
                height: { xs: 60, sm: 70 },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 3,
                background: 'rgba(52, 152, 219, 0.1)',
                transition: 'all 0.4s ease',
                border: '2px solid rgba(52, 152, 219, 0.2)',
              }}
            >
              {feature.icon}
            </Box>
            <Box flex={1}>
              <Box display="flex" alignItems="center" gap={1.5} mb={1.5} flexWrap="wrap">
                <Typography 
                  variant="h6" 
                  component="h3" 
                  fontWeight={700}
                  fontSize={{ xs: '1.15rem', sm: '1.3rem' }}
                  sx={{
                    background: 'linear-gradient(45deg, #2c3e50, #3498db)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {feature.title}
                </Typography>
                {feature.isCore && (
                  <Chip
                    label="Core Feature"
                    size="small"
                    color="primary"
                    variant="filled"
                    sx={{
                      fontSize: '0.75rem',
                      height: 26,
                      fontWeight: 700,
                      background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
                      boxShadow: '0 2px 8px rgba(255, 107, 107, 0.3)',
                    }}
                  />
                )}
              </Box>
              <Typography 
                variant="body2" 
                color="text.secondary" 
                lineHeight={1.7}
                fontSize={{ xs: '0.92rem', sm: '1.05rem' }}
                sx={{
                  opacity: 0.9,
                  fontWeight: 400,
                }}
              >
                {feature.description}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Fade>
  ))}

  {/* Learn More Button */}
  <Box textAlign={{ xs: 'center', md: 'left' }} mt={5}>
    <Button
      variant="contained"
      size="large"
      endIcon={<ArrowForwardIos sx={{ transition: 'transform 0.3s ease' }} />}
      sx={{
        borderRadius: 3,
        px: 5,
        py: 1.8,
        fontSize: { xs: '1.05rem', sm: '1.15rem' },
        fontWeight: 700,
        background: 'linear-gradient(45deg, #3498db, #2c3e50)',
        boxShadow: '0 8px 25px rgba(52, 152, 219, 0.3)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: '-100%',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
          transition: 'left 0.5s ease',
        },
        '&:hover': {
          background: 'linear-gradient(45deg, #2980b9, #34495e)',
          transform: 'translateY(-3px)',
          boxShadow: '0 12px 35px rgba(52, 152, 219, 0.4)',
          '&::before': {
            left: '100%',
          },
          '& .MuiButton-endIcon': {
            transform: 'translateX(4px)',
          },
        },
        transition: 'all 0.4s ease',
        minWidth: { xs: '100%', sm: 'auto' },
      }}
    >
      Explore All Features
    </Button>
  </Box>
</Box>

             
          <Box sx={{ width: { xs: '100%', md: '50%' } }}>
            <Box
              sx={{
                position: 'relative',
                borderRadius: 4,
                overflow: 'hidden',
                boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
                height: { xs: '300px', sm: '400px', md: '500px' },
                marginTop: { xs: 2, md: 0 },
              }}
            
            >
              {/* Image Display with Error Handling */}
              <Box
                sx={{
                  width: '100%',
                  height: '100%',
                  position: 'relative',
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}20, ${theme.palette.secondary.main}20)`,
                }}
              >
                {carouselImages.map((image, index) => (
                  <Fade
                    key={index}
                    in={index === currentImageIndex}
                    timeout={500}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                    }}
                  >
                    <Box
                      sx={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'column',
                        p: 2,
                      }}
                    >
                      {!imageErrors[index] ? (
                        <Box
                          component="img"
                          src={image.src}
                          alt={image.alt}
                          onError={() => handleImageError(index)}
                          sx={{
                            maxWidth: '100%',
                            maxHeight: '100%',
                            objectFit: 'contain',
                            borderRadius: 2,
                          }}
                        />
                      ) : (
                        <Box
                          sx={{
                            width: '80%',
                            height: '80%',
                            background: `linear-gradient(135deg, ${theme.palette.primary.main}30, ${theme.palette.secondary.main}30)`,
                            borderRadius: 3,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '2px dashed rgba(255,255,255,0.3)',
                            flexDirection: 'column',
                            p: 2,
                          }}
                        >
                          <Typography
                            variant="h6"
                            textAlign="center"
                            color="text.secondary"
                          >
                            {image.alt}
                          </Typography>
                          <Typography 
                            variant="body2" 
                            sx={{ mt: 1, opacity: 0.8 }}
                            textAlign="center"
                          >
                            {image.description}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Fade>
                ))}
              </Box>

              {/* Carousel Controls */}
              {!isSmallMobile && (
                <>
                  <IconButton
                    onClick={prevImage}
                    sx={{
                      position: 'absolute',
                      left: 16,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      backgroundColor: 'rgba(255,255,255,0.9)',
                      '&:hover': { backgroundColor: 'white' },
                      opacity: 0.8,
                      transition: 'opacity 0.3s ease',
                    
                    }}
                  >
                    <ArrowBackIos />
                  </IconButton>
                  <IconButton
                    onClick={nextImage}
                    sx={{
                      position: 'absolute',
                      right: 16,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      backgroundColor: 'rgba(255,255,255,0.9)',
                      '&:hover': { backgroundColor: 'white' },
                      opacity: 0.8,
                      transition: 'opacity 0.3s ease',
                    
                    }}
                  >
                    <ArrowForwardIos />
                  </IconButton>
                </>
              )}

              {/* Carousel Indicators */}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 16,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  display: 'flex',
                  gap: 1,
                  background: 'rgba(0,0,0,0.3)',
                  borderRadius: 2,
                  p: 1,
                }}
              >
                {carouselImages.map((_, index) => (
                  <Box
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      backgroundColor: index === currentImageIndex ? 'white' : 'rgba(255,255,255,0.5)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: 'white',
                        transform: 'scale(1.2)',
                      },
                    }}
                  />
                ))}
              </Box>

              {/* Auto-play Status Indicator */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  background: 'rgba(0,0,0,0.5)',
                  borderRadius: 2,
                  px: 1,
                  py: 0.5,
                }}
              >
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: isAutoPlaying ? '#4CAF50' : '#ff9800',
                    animation: isAutoPlaying ? 'pulse 2s infinite' : 'none',
                    '@keyframes pulse': {
                      '0%': { opacity: 1 },
                      '50%': { opacity: 0.5 },
                      '100%': { opacity: 1 },
                    },
                  }}
                />
                <Typography variant="caption" color="white" fontSize="0.7rem">
                  {isAutoPlaying ? 'Auto' : 'Paused'}
                </Typography>
              </Box>
            </Box>
    <Box
  sx={{
    mt: 6,
    mb:3,
    overflow: 'visible',
    height: { xs: '200px', sm: '250px', md: '300px' },
    display: 'flex',
    alignItems: 'flex-start', // Changed from 'center' to 'flex-start'
    justifyContent: 'center',
    paddingTop: 4, // Added top padding to push content down
  }}
>
  <Box
    component="img"
    src="/images/heartrate-png.png"
    alt="Beating Heart"
    sx={{
      width: '120%',
      height: '120%',
      objectFit: 'contain',
      borderRadius: 2,
      animation: 'heartbeat 1.5s ease-in-out infinite both',
      marginTop: 2, // Additional margin to push down
      '@keyframes heartbeat': {
        '0%': {
          transform: 'scale(1)',
        },
        '14%': {
          transform: 'scale(1.15)',
        },
        '28%': {
          transform: 'scale(1)',
        },
        '42%': {
          transform: 'scale(1.15)',
        },
        '70%': {
          transform: 'scale(1)',
        },
      }
    }}
  />
</Box>
          </Box>
          
        </Box>
      </Container>
    </Box>
  );
};

export default TechnologyOfCareSection;