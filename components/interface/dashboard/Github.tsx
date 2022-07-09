import { Avatar, Card, Group, Skeleton, Stack, Text } from "@mantine/core";
import { Octokit } from "@octokit/core";
import { Endpoints } from "@octokit/types";
import { useEffect, useState } from "react";


export function GitHub({token}: { token: string }) {

    const octokit = new Octokit({ auth: token });
    const [user, setUser] = useState<Endpoints['GET /user']["response"]["data"] | null>(null)
    const [events, setEvents] = useState<Endpoints['GET /events']["response"]["data"] | null>(null)

    const getGithubUser = async (token: string): Promise<Endpoints['GET /user']["response"]["data"]> => {
        const response = await octokit.request('GET /user', {})
        return response.data;
    }

    const getGithubEvents = async (login: string): Promise<Endpoints['GET /events']["response"]["data"]> => {
        const response = await octokit.request('GET /users/{username}/events', {
            username: login
        })
        console.log(response.data)
        return response.data;
    }

    useEffect(() => {
        getGithubUser(token).then(user => {
            setUser(user)
            getGithubEvents(user.login).then(events => setEvents(events))
        })
    }, [])

    return (
        <>
            <Card shadow="sm">
                { user ? 
                    <Group>
                        <Avatar src={user.avatar_url} size="xl" radius={999} />
                        <Stack spacing={0}>
                            <Text size="xl" weight="bold">{user.name}</Text>
                            <Text>{user.login}</Text>
                            <Text color="dimmed">{user.bio ? user.bio.slice(0, 64) : "No bio"}</Text>
                        </Stack>
                    </Group> :
                    <Skeleton>
                        <Group>
                            <Avatar size="xl" radius={999} />
                            <Stack spacing={0}>
                                <Text size="xl" weight="bold">Placeholder</Text>
                                <Text>Placeholder</Text>
                                <Text color="dimmed">Placeholder</Text>
                            </Stack>
                        </Group>
                    </Skeleton>
                }
                {
                    events &&
                    <Stack>
                        {events.map((event, i) => (
                            <Text key={i}>{JSON.stringify(event)}</Text>
                        ))}
                    </Stack>
                }
                
            </Card>
        </>
    );
}
