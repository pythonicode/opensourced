import { Avatar, Card, Group, Skeleton, Stack, Text, ThemeIcon } from "@mantine/core";
import { Octokit } from "@octokit/core";
import { Endpoints } from "@octokit/types";
import { useEffect, useState } from "react";
import { FaArrowUp,  FaPlus } from "react-icons/fa";
import { MdMergeType } from 'react-icons/md'

type ActivityProps = {
    event: Endpoints['GET /events']["response"]["data"][0]
}

export function Activity({ event }: ActivityProps) {
    return <Group p="xl"  position="apart" sx={{border: "#CCCCCC solid 1px"}}>
        <Group>
            { 
                event.type === "PushEvent" ? <ThemeIcon size="xl"><FaArrowUp  size="1.5rem"/></ThemeIcon> : event.type === "CreateEvent" ? <ThemeIcon color="green" size="xl"><FaPlus size="1.5rem" /></ThemeIcon> : event.type == "PullRequestEvent" ? <ThemeIcon color="violet" size="xl"><MdMergeType size="1.5rem" /></ThemeIcon> : null
            }
            <Stack spacing={0}>
                <Text>
                { 
                    event.type === "PushEvent" ? "Changes Pushed": event.type === "CreateEvent" ? "Created Repository" : event.type == "PullRequestEvent" ? "Pull Request Merged" : null
                }
                </Text>
                <Text size="sm" color="dimmed">
                {
                    event.repo.name
                }
                </Text>
            </Stack>
        </Group>
        <Text size="xl">+25</Text>
    </Group>
}


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
        return response.data;
    }

    useEffect(() => {
        getGithubUser(token).then(user => {
            setUser(user)
            getGithubEvents(user.login).then(events => setEvents(events))
        })
    }, [])

    useEffect(() => {console.log(events)}, [events])

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
                    <Stack mt="xl">
                        {events.map((event, i) => (
                            (event.type === "PushEvent" || event.type ===  "CreateEvent" ||  event.type === "PullRequestEvent")
                            && <Activity key={i} event={event} />
                        ))}
                    </Stack>
                }
                
            </Card>
        </>
    );
}
