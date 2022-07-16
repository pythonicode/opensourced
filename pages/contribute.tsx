import { Button, Card, Text, Stack, Title, Group, TextInput, Badge } from '@mantine/core';
import { Fade } from 'react-awesome-reveal';
import { Image } from '@mantine/core';
import { FaCoins, FaWallet } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { getSmartContract } from '@/lib/tron';
import { MdMoney } from 'react-icons/md';
import { TokensIcon } from '@modulz/radix-icons';

export default function Contribute() {
  const [address, setAddress] = useState(null);

  useEffect(() => {
    if (!window.tronWeb) return;
    window.tronWeb.isConnected().then(() => {
      setAddress(window.tronWeb.defaultAddress.hex);
      getSmartContract('TKWJdrQkqHisa1X8HUdHEfREvTzw4pMAaY').then((contract) => {
        console.log(contract);
      });
    });
  });

  return (
    <Fade triggerOnce>
      <Stack
        justify="center"
        align="center"
        sx={{ minHeight: '100vh', width: '100vw', overflowX: 'hidden' }}
      >
        <Image
          src="/images/vault.svg"
          alt="Contibution vault"
          sx={{ width: 'clamp(200px, 50vw, 500px)' }}
        />
        <Title align="center">Stake your TRX to support Opensource</Title>
        {address ? (
          <Stack justify="center" align="center" m="xl" sx={{ maxWidth: '512px', width: '90%' }}>
            <Group grow sx={{ width: '100%' }}>
              <Group
                align="center"
                p="sm"
                sx={{
                  border: '1px solid #CCCCCC',
                  borderRadius: '4px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                }}
              >
                <Badge>STAKED</Badge>
                <Text>0</Text>
                <Text>TRX</Text>
              </Group>
              <Group
                align="center"
                p="sm"
                sx={{
                  border: '1px solid #CCCCCC',
                  borderRadius: '4px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                }}
              >
                <Badge>BALANCE</Badge>
                <Text>0</Text>
                <Text>TRX</Text>
              </Group>
            </Group>
            <TextInput icon={<FaWallet />} value={address} sx={{ width: '100%' }} disabled />
            <TextInput icon={<FaCoins />} placeholder="Amount to stake" sx={{ width: '100%' }} />
            <Button fullWidth>Stake TRX</Button>
            <Button color="red" fullWidth>
              Unstake TRX
            </Button>
          </Stack>
        ) : null}
      </Stack>
    </Fade>
  );
}
