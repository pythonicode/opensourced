import Layout from '@/components/layout/Layout';
import { Button, Grid, Modal, Text, TextInput } from '@mantine/core';
import { Fade } from 'react-awesome-reveal';
import { doc, DocumentData, getDoc, setDoc } from "firebase/firestore";
import { useState } from 'react';
import { useEffect } from 'react';
import { auth, db } from '@/lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { showNotification } from '@mantine/notifications';
import { GitHub } from '@/components/interface/dashboard/Github';
import { Octokit } from '@octokit/core';
import { Endpoints } from '@octokit/types';

export default function Dashboard() {

    const [user, loading, error] = useAuthState(auth);
    const [data, setData] = useState<DocumentData | null>(null)
    const [account, setAccount] = useState('')
    const [github, setGithub] = useState<Endpoints['GET /user']["response"]["data"] | null>(null)

    const getUser = async (user: any) => {
        const ref = doc(db, "users", user.uid);
        const snap = await getDoc(ref);
        return snap.exists() ? snap.data() : null
    }

    const setWalletAddress = async () => {
        if(!user) return
        try {
            await setDoc(doc(db, 'users', user.uid), {
                account: account,
            }, {merge: true})
            setData({...data, account: account})
        } catch (error: any) {
            showNotification({title: "There was a problem signing in", message: error.message})
        } 
    }

    const getGithubUser = async (token: string): Promise<Endpoints['GET /user']["response"]["data"]> => {
        const octokit = new Octokit({ auth: token });
        const response = await octokit.request('GET /user', {})
        return response.data;
    }

    useEffect(() => {
        if(user) getUser(user).then((data) => setData(data))
    }, [user])

    if(!data) return null;

    return (
        <Fade triggerOnce>
            <Modal
                opened={data.account == null}
                onClose={() => {}}
                withCloseButton={false}
            >
                <Text pt="xl">Finished setting up your account</Text>
                <TextInput value={account} onChange={(e) => setAccount(e.currentTarget.value)} placeholder='Wallet Address' my="md"/>
                <Button onClick={setWalletAddress} fullWidth my="md">Continue</Button>
                <Text pb="xl" size="xs" color="dimmed">Please input your wallet address exactly as it appears on your Tron wallet app otherwise payments may be lost. If you do not have a Tron wallet please visit <Text variant="link" component='a' href="https://www.tronlink.org/" inherit>Tron Link</Text> to create a free wallet.</Text>
            </Modal>
            <Layout>
                <Grid grow>
                    <Grid.Col md={4}>
                        <GitHub token={data.token} />
                    </Grid.Col>
                    <Grid.Col md={4}>
                        <GitHub token={data.token} />
                    </Grid.Col>
                </Grid>
            </Layout>
        </Fade>
    );
}
