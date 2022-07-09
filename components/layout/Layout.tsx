import { ReactNode, useState } from 'react';
import {
  AppShell,
  Navbar,
  Header,
  Footer,
  Image,
  Text,
  MediaQuery,
  Burger,
  useMantineTheme,
  Title,
  Group,
  ThemeIcon,
  MantineColor,
  Center,
} from '@mantine/core';
import { FaCog, FaGhost, FaHome } from 'react-icons/fa';
import Link from 'next/link';

function NavigationLink({icon, title, color, href=""}: {icon: ReactNode, title: string, color?: MantineColor, href?: string}) {
    return (
        <Link href={href}>
            <Group p="md" sx={(theme) => ({cursor: 'pointer', transition: 'all', transitionDuration: '300ms', borderRadius: '0.5rem', ':hover': {backgroundColor: theme.colors.gray[1]}})}>
                <ThemeIcon color={color}>{icon}</ThemeIcon>
                <Text>{title}</Text>
            </Group>
        </Link>
    )
}

export default function Layout({children}: {children: ReactNode}) {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);

  return (
    <AppShell
      styles={{
        main: {
          background: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
        },
      }}
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      fixed
      navbar={
        <Navbar p="md" hiddenBreakpoint="sm" hidden={!opened} width={{ sm: 200, lg: 300 }}>
            <NavigationLink icon={<FaHome />} title="Home"/>
            <NavigationLink icon={<FaCog />} title="Settings" color="gray" />
        </Navbar>
      }
      footer={
        <Footer height={60} p="md">
          <Center><Text size="sm" color="dimmed">Random Footer Text</Text></Center>
        </Footer>
      }
      header={
        <Header height={70} p="md">
          <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
            <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
              <Burger
                opened={opened}
                onClick={() => setOpened((o) => !o)}
                size="sm"
                color={theme.colors.gray[6]}
                mr="xl"
              />
            </MediaQuery>
            <Image src="logo.png" alt="Logo" width="32px" mr={2} />
            <Title order={2} align="center">pensourced</Title>
          </div>
        </Header>
      }
    >
        {children}
    </AppShell>
  );
}