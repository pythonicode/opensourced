import { Welcome } from '@/components/interface/index/Welcome';
import { Stack } from '@mantine/core';
import { Fade } from 'react-awesome-reveal';
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

export default function Home() {

  const particlesInit = async (main: any) => {
    await loadFull(main);
  };

  return (
    <Fade triggerOnce>
    <Stack justify="center" align="center" sx={{minHeight: '100vh', width: '100vw', overflowX: 'hidden'}}>
      <Welcome />
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          backgroundMode: {
            enable: true,
            zIndex: -1
          },
          fpsLimit: 60,
          interactivity: {
            detectsOn: "canvas",
            events: {
              onClick: { enable: true, mode: "repulse" },
              onHover: {
                enable: true,
                mode: "bubble",
                parallax: { enable: false, force: 2, smooth: 10 }
              },
              resize: true
            },
            modes: {
              bubble: {
                distance: 400,
                duration: 0.3,
                opacity: 1,
                size: 4,
              },
              grab: { distance: 400, line_linked: { opacity: 0.5 } },
              push: { particles_nb: 4 },
              remove: { particles_nb: 2 },
              repulse: { distance: 200, duration: 0.4 }
            }
          },
          particles: {
            color: { value: '#000' },
            links: {
              color: "#ffffff",
              distance: 500,
              enable: false,
              opacity: 0.4,
              width: 2
            },
            move: {
              attract: { enable: false, rotateX: 600, rotateY: 1200 },
              direction: "bottom",
              enable: true,
              outMode: "out",
              random: false,
              size: true,
              speed: 4,
              straight: false
            },
            number: { density: { enable: true, area: 5000 }, value: 200 },
            opacity: {
              random: true,
              value: 0.5
            },
            shape: {
              type: "circle"
            },
            size: {
              random: true,
              value: 10
            }
          },
          detectRetina: true
        }}
      />
    </Stack></Fade>
  );
}
