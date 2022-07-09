import { AppProps } from 'next/app';
import Head from 'next/head';
import 'styles/global.css'
import { MantineProvider, MantineProviderProps } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import { useColorScheme } from '@mantine/hooks';

export default function App({ Component, pageProps }: AppProps) {

  const options: MantineProviderProps["theme"] = {
    colorScheme: 'light',
    primaryColor: 'indigo',
    fontFamily: 'Inter',
    headings: {
      fontFamily: 'Inter'
    }
  } 

  return (
    <>
      <Head>
        <title>Opensourced</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
        <link rel="shortcut icon" href="/favicon.ico" />
      </Head>
      <MantineProvider theme={options} withGlobalStyles withNormalizeCSS>
        <NotificationsProvider>
          <Component {...pageProps} />
        </NotificationsProvider>
      </MantineProvider>
    </>
  );
}