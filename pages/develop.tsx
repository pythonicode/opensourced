import {
  Group,
  Image,
  Text,
  MediaQuery,
  Stack,
  Timeline,
  Title,
  Button,
  Divider,
  TextInput,
} from '@mantine/core';
import { FaCoins, FaGithub, FaWallet } from 'react-icons/fa';
import { Fade } from 'react-awesome-reveal';
import { GithubAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { useRouter } from 'next/router';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useEffect, useState } from 'react';
import { showNotification } from '@mantine/notifications';
import { setDoc, doc } from 'firebase/firestore';

const provider = new GithubAuthProvider();

export default function Develop() {
  const router = useRouter();
  const [user, loading, error] = useAuthState(auth);

  useEffect(() => {
    if (user) router.replace('/dashboard');
  }, [user, loading]);

  useEffect(() => {
    if (error) showNotification({ title: error.name, message: error.message });
  }, [error]);

  const signInWithGithub = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const credential = GithubAuthProvider.credentialFromResult(result);
      const token = credential ? credential.accessToken! : null;
      const user = result.user;
      try {
        await setDoc(
          doc(db, 'users', user.uid),
          {
            token: token,
          },
          { merge: true }
        );
        router.replace('/dashboard');
      } catch (error: any) {
        showNotification({ title: 'There was a problem signing in', message: error.message });
      }
    } catch (error: any) {
      showNotification({ title: 'There was a problem signing in', message: error.message });
    }
  };

  if (loading) return null;

  return (
    <Fade triggerOnce>
      <MediaQuery smallerThan="sm" styles={{ flexDirection: 'column' }}>
        <Group sx={{ minHeight: '100vh', width: '100vw', overflow: 'hidden' }} grow>
          <Stack
            align="center"
            justify="center"
            spacing={64}
            p="xl"
            sx={(theme) => ({
              backgroundColor: theme.colors.indigo[5],
              minHeight: '100vh',
              maxWidth: '100vw',
            })}
          >
            <Image
              src="images/freelancer.svg"
              alt="Freelancer writing code on his laptop."
              width="300px"
            />
            <Title align="center" sx={{ maxWidth: '32ch' }}>
              Earn Cryptocurrency for Contributing to Open Source Projects
            </Title>
            <Timeline
              active={3}
              bulletSize={24}
              lineWidth={2}
              sx={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '0.5rem' }}
            >
              <Timeline.Item bullet={<FaGithub />} title="Login with Github" pb="xl">
                <Text size="sm" color="dimmed">
                  Sign in with GitHub so we can gather some information about your account.
                </Text>
              </Timeline.Item>
              <Timeline.Item bullet={<FaWallet />} title="Connect to your Tron Wallet" pb="xl">
                <Text size="sm" color="dimmed">
                  Enter your Tron wallet address or connect with a TronLink wallet.
                </Text>
              </Timeline.Item>
              <Timeline.Item bullet={<FaCoins />} title="Start Collecting Rewards">
                <Text size="sm" color="dimmed">
                  Visit this page to collect rewards for any open source code that you've
                  contributed.
                </Text>
              </Timeline.Item>
            </Timeline>
          </Stack>
          <Stack
            align="center"
            justify="center"
            p="xl"
            sx={{ maxWidth: '100vw', minHeight: '100vh' }}
            py={100}
          >
            <Title align="center">Get Started</Title>
            <Divider my="md" sx={{ width: '50%' }} />
            <Button size="xl" color="dark" leftIcon={<FaGithub />} onClick={signInWithGithub}>
              Sign in with Github
            </Button>
            <Text size="xs" color="dimmed" align="center">
              Before signing in we recommend reading the{' '}
              <Text
                variant="link"
                component="a"
                href="https://docs.github.com/en/site-policy/github-terms/github-terms-of-service"
                inherit
              >
                Terms of Service
              </Text>
            </Text>
          </Stack>
        </Group>
      </MediaQuery>
    </Fade>
  );
}
