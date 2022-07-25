import { Button, Card, Text, Stack, Title, Group, TextInput, Badge, Loader } from '@mantine/core';
import { Fade } from 'react-awesome-reveal';
import { Image } from '@mantine/core';
import { FaCoins, FaWallet } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { formatBalance, getSmartContract } from '@/lib/tron';
import { MdMoney } from 'react-icons/md';
import { TokensIcon } from '@modulz/radix-icons';

export default function Contribute() {
  const [account, setAccount] = useState<string | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [staked, setStaked] = useState<string | null>(null);

  useEffect(() => {
    if (!window.tronWeb) return;
    window.tronWeb
      .isConnected()
      .then(() => {
        setAccount(window.tronWeb.defaultAddress.base58);
        window.tronWeb.trx
          .getBalance(window.tronWeb.defaultAddress.base58)
          .then((balance: any) => {
            setBalance(balance);
          })
          .catch((err: any) => console.error(err));
        getSmartContract('TKWJdrQkqHisa1X8HUdHEfREvTzw4pMAaY')
          .then((contract) => {
            console.log(contract);
          })
          .catch((err: any) => console.error(err));
      })
      .catch((err: any) => console.error(err));
  }, []);

  return (
    <Fade triggerOnce>
      <Stack
        justify="center"
        align="center"
        sx={{ minHeight: '100vh', width: '100vw', overflowX: 'hidden' }}
        spacing="xl"
      >
        <Image
          src="/images/vault.svg"
          alt="Contibution vault"
          sx={{ width: 'clamp(200px, 50vw, 500px)' }}
        />
        <Title align="center">Stake your TRX to support Opensource</Title>
        {account ? (
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
                {balance ? <Text>{formatBalance(balance)}</Text> : <Loader size="xs" />}
                <Text>TRX</Text>
              </Group>
            </Group>
            <TextInput icon={<FaWallet />} value={account} sx={{ width: '100%' }} disabled />
            <TextInput icon={<FaCoins />} placeholder="Amount to stake" sx={{ width: '100%' }} />
            <Button fullWidth>Stake TRX</Button>
            <Button color="red" fullWidth>
              Unstake TRX
            </Button>
          </Stack>
        ) : (
          <>
            <Text variant="link" component="a" href="https://www.tronlink.org/">
              Before continuing, please install TronLink here.
            </Text>
            <Text size="xs">or if TronLink is already installed. Try logging in.</Text>
          </>
        )}
      </Stack>
    </Fade>
  );
}
