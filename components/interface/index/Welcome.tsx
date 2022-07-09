import { auth } from '@/lib/firebase';
import { Title, Button, Group, MediaQuery, Image } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import Link from 'next/link';
import { useAuthState } from 'react-firebase-hooks/auth';

export function Welcome() {
  const [user, loading, error] = useAuthState(auth);
  
  return (
    <>
      <Group spacing={5}>
        <Image src="logo.png" width="clamp(64px, 10vw, 200px)"/>
        <Title align='center' sx={{ fontSize: "clamp(50px, 5vw, 200px)"}}>
            pensourced
        </Title>
      </Group>
      <MediaQuery smallerThan="sm" styles={{m: 'md'}}>
        <Group align="center" position="center">
          <Link href='/contribute'>
            <Button size="xl">For Contributors</Button>
          </Link>
          <Link href={user ? '/dashboard' : '/develop'}>
            <Button variant="outline" size="xl">For Developers</Button>
          </Link>
        </Group>
      </MediaQuery>
    </>
  );
}
