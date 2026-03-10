'use client';

import { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
} from '@mui/material';
import { styled, alpha, useTheme } from '@mui/material/styles';
import {
  NotificationsActive,
  FamilyRestroom,
  MedicalServices,
  Security,
  Analytics,
  SupportAgent,
  PlayArrow,
  Pause,
} from '@mui/icons-material';

/* ───────────────────────── STYLED LAYOUT ───────────────────────── */

const Section = styled('section')(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  position: 'relative',
  overflow: 'hidden',
  background:
    'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
}));

const Background = styled('div')(({ theme }) => ({
  position: 'absolute',
  inset: 0,
  zIndex: 0,
  background: `
    radial-gradient(circle at 20% 80%, ${alpha(theme.palette.primary.main, 0.1)} 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, ${alpha(theme.palette.secondary.main, 0.1)} 0%, transparent 50%),
    radial-gradient(circle at 40% 40%, ${alpha(theme.palette.info.main, 0.05)} 0%, transparent 50%)
  `,
}));

const Header = styled('div')(({ theme }) => ({
  textAlign: 'center',
  marginBottom: theme.spacing(8),
}));

const ContentGrid = styled('div')(({ theme }) => ({
  display: 'grid',
  gap: theme.spacing(6),
  alignItems: 'center',

  [theme.breakpoints.up('lg')]: {
    gridTemplateColumns: '1fr 1fr',
  },
}));

const FeaturePreview = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.spacing(2),
  overflow: 'hidden',
  border: `1px solid ${alpha('#fff', 0.1)}`,
  background: 'linear-gradient(145deg, #1e293b, #0f172a)',
  boxShadow: `0 25px 50px ${alpha('#000', 0.5)}`,
}));

const FeatureImage = styled('div')<{
  image: string;
  color: string;
}>(({ image, color }) => ({
  height: 400,
  backgroundImage: `url(${image})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  position: 'relative',

  '&::after': {
    content: '""',
    position: 'absolute',
    inset: 0,
    background: `linear-gradient(135deg, ${alpha(
      color,
      0.15
    )} 0%, rgba(15,23,42,0.75) 100%)`,
  },
}));

const FeatureGrid = styled('div')(({ theme }) => ({
  display: 'grid',
  gap: theme.spacing(3),

  [theme.breakpoints.up('sm')]: {
    gridTemplateColumns: 'repeat(2, 1fr)',
  },
}));

const FeatureCard = styled(Card)<{
  active: boolean;
  accent: string;
}>(({ theme, active, accent }) => ({
  background: `linear-gradient(145deg, ${alpha(
    '#1e293b',
    0.85
  )}, ${alpha('#0f172a', 0.95)})`,
  borderRadius: theme.spacing(2),
  border: `1px solid ${
    active ? alpha(accent, 0.4) : alpha('#fff', 0.1)
  }`,
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  transform: active ? 'translateY(-6px)' : 'none',

  '&:hover': {
    transform: 'translateY(-4px)',
    borderColor: alpha(accent, 0.3),
  },
}));

const ProgressBar = styled('div')<{ active: boolean }>(({ active }) => ({
  flex: 1,
  height: 4,
  borderRadius: 2,
  cursor: 'pointer',
  backgroundColor: active
    ? 'rgba(255,255,255,0.85)'
    : 'rgba(255,255,255,0.25)',
  transition: 'background-color 0.3s ease',
}));

/* ───────────────────────── DATA ───────────────────────── */

const FEATURES = [
  {
    title: 'Real-time Alerts',
    description:
      '24/7 monitoring with instant alerts for immediate response.',
    icon: <NotificationsActive />,
    color: '#ef4444',
    image: '/images/realtimaleart.png',
  },
  {
    title: 'Family Notifications',
    description:
      'Loved ones receive updates instantly for coordination.',
    icon: <FamilyRestroom />,
    color: '#3b82f6',
    image: '/images/familynotify.png',
  },
  {
    title: 'Healthcare Integration',
    description:
      'Direct alerts to healthcare professionals when needed.',
    icon: <MedicalServices />,
    color: '#22c55e',
    image: '/images/health.png',
  },
  {
    title: 'Proactive Safety',
    description:
      'AI-driven predictive analysis to prevent incidents.',
    icon: <Security />,
    color: '#f59e0b',
    image: '/images/proactive-safety.png',
  },
  {
    title: 'Smart Analytics',
    description:
      'Advanced analytics to identify long-term patterns.',
    icon: <Analytics />,
    color: '#06b6d4',
    image: '/images/smart-analytics.png',
  },
  {
    title: '24/7 Support',
    description:
      'Round-the-clock monitoring by professionals.',
    icon: <SupportAgent />,
    color: '#a855f7',
    image: '/images/24-7-support.png',
  },
];

/* ───────────────────────── COMPONENT ───────────────────────── */

export default function AIOperationsSection() {
  const theme = useTheme();
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(
      () => setActive((p) => (p + 1) % FEATURES.length),
      4000
    );
    return () => clearInterval(id);
  }, [playing]);

  const current = FEATURES[active];

  return (
    <Section>
      <Background />

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
        <Header>
          <Chip
            label="AI-Powered Safety"
            sx={{
              mb: 3,
              px: 3,
              py: 1,
              fontWeight: 600,
              bgcolor: alpha(theme.palette.primary.main, 0.2),
              color: theme.palette.primary.light,
            }}
          />
          <Typography variant="h2" fontWeight={800} gutterBottom>
            AI Operations Center
          </Typography>
          <Typography color="grey.300" maxWidth={600} mx="auto">
            Continuous AI monitoring that alerts families and
            healthcare professionals in real time.
          </Typography>
        </Header>

        <ContentGrid>
          {/* LEFT */}
          <FeaturePreview>
            <FeatureImage
              image={current.image}
              color={current.color}
            />
            <div style={{ padding: 24 }}>
              <Typography color="grey.200" mb={3}>
                {current.description}
              </Typography>

              <div style={{ display: 'flex', gap: 12 }}>
                <Button
                  onClick={() => setPlaying(!playing)}
                  sx={{
                    minWidth: 40,
                    height: 40,
                    borderRadius: '50%',
                    bgcolor: alpha(theme.palette.primary.main, 0.3),
                    color: '#fff',
                  }}
                >
                  {playing ? <Pause /> : <PlayArrow />}
                </Button>

                <div style={{ display: 'flex', gap: 6, flex: 1 }}>
                  {FEATURES.map((_, i) => (
                    <ProgressBar
                      key={i}
                      active={i === active}
                      onClick={() => {
                        setActive(i);
                        setPlaying(false);
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </FeaturePreview>

          {/* RIGHT */}
          <FeatureGrid>
            {FEATURES.map((f, i) => (
              <FeatureCard
                key={f.title}
                active={i === active}
                accent={f.color}
                onClick={() => {
                  setActive(i);
                  setPlaying(false);
                }}
              >
                <CardContent>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <div style={{ color: f.color }}>{f.icon}</div>
                    <div>
                      <Typography color="white" fontWeight={600}>
                        {f.title}
                      </Typography>
                      <Typography color="grey.400" fontSize="0.85rem">
                        {f.description}
                      </Typography>
                    </div>
                  </div>
                </CardContent>
              </FeatureCard>
            ))}
          </FeatureGrid>
        </ContentGrid>
      </Container>
    </Section>
  );
}
