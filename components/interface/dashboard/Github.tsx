import { formatBalance, getSmartContract } from '@/lib/tron';
import { GithubEvent } from '@/lib/types';
import { Avatar, Card, Group, Image, Skeleton, Stack, Text, ThemeIcon } from '@mantine/core';
import { Octokit } from '@octokit/core';
import { Endpoints } from '@octokit/types';
import { useEffect, useState } from 'react';
import { FaArrowUp, FaPlus } from 'react-icons/fa';
import { MdMergeType, MdWarning } from 'react-icons/md';

type ActivityProps = {
  event: GithubEvent;
};

const supported = ['PullRequestEvent', 'PushEvent', 'CreateEvent', 'IssuesEvent'];

export function Activity({ event }: ActivityProps) {
  if (event.type === 'PullRequestEvent' && !event.payload.pull_request.merged) return null;
  else if (event.type === 'CreateEvent' && event.payload.ref_type != 'repository') return null;
  return (
    <Group p="xl" position="apart" sx={{ border: '#CCCCCC solid 1px' }}>
      <Group>
        {event.type === 'PushEvent' ? (
          <ThemeIcon size="xl">
            <FaArrowUp size="1.5rem" />
          </ThemeIcon>
        ) : event.type === 'CreateEvent' ? (
          <ThemeIcon color="green" size="xl">
            <FaPlus size="1.5rem" />
          </ThemeIcon>
        ) : event.type == 'PullRequestEvent' ? (
          <ThemeIcon color="violet" size="xl">
            <MdMergeType size="1.5rem" />
          </ThemeIcon>
        ) : event.type === 'IssuesEvent' ? (
          <ThemeIcon color="orange" size="xl">
            <MdWarning size="1.5rem" />
          </ThemeIcon>
        ) : null}
        <Stack spacing={0}>
          <Text>
            {event.type === 'PushEvent'
              ? 'Changes Pushed'
              : event.type === 'CreateEvent'
              ? 'Created Repository'
              : event.type == 'PullRequestEvent'
              ? 'Pull Request Merged'
              : event.type == 'IssuesEvent'
              ? 'Issue Created'
              : 'Unknown'}
          </Text>
          <Text size="sm" color="dimmed">
            {event.repo.name}
          </Text>
        </Stack>
      </Group>
      <Group>
        <Text size="xl">
          {event.type === 'PushEvent' ? (
            formatBalance(event.payload.commits.length, 0)
          ) : event.type === 'CreateEvent' ? (
            formatBalance(1, 0)
          ) : event.type == 'PullRequestEvent' ? (
            <ThemeIcon color="violet" size="xl">
              <MdMergeType size="1.5rem" />
            </ThemeIcon>
          ) : event.type === 'IssuesEvent' ? (
            formatBalance(0.25, 0)
          ) : null}
        </Text>
        <Image src="images/token.svg" alt="token" width="25px" />
      </Group>
    </Group>
  );
}

export function GitHub({ account, token }: { account: string; token: string }) {
  const octokit = new Octokit({ auth: token });
  const [user, setUser] = useState<Endpoints['GET /user']['response']['data'] | null>(null);
  const [balance, setBalance] = useState<number>(0);
  const [events, setEvents] = useState<Endpoints['GET /events']['response']['data'] | null>(null);

  const getGithubUser = async (
    token: string
  ): Promise<Endpoints['GET /user']['response']['data']> => {
    const response = await octokit.request('GET /user', {});
    return response.data;
  };

  const getGithubEvents = async (
    login: string
  ): Promise<Endpoints['GET /events']['response']['data']> => {
    const response = await octokit.request('GET /users/{username}/events', {
      username: login,
    });
    console.log(response.data);
    return response.data;
  };

  useEffect(() => {
    getGithubUser(token).then((user) => {
      setUser(user);
      getGithubEvents(user.login).then((events) => setEvents(events));
    });
    getSmartContract('TKmgNGi49rEc3rsLrZnPNB7WiymKB9MHJ4').then((contract) =>
      contract
        .balanceOf(account)
        .call()
        .then((balance: number) => setBalance(balance))
    );
  }, []);

  return (
    <>
      <Card shadow="sm">
        <Group position="apart">
          {user ? (
            <Group>
              <Avatar src={user.avatar_url} size="xl" radius={999} />
              <Stack spacing={0}>
                <Text size="xl" weight="bold">
                  {user.name}
                </Text>
                <Text>{user.login}</Text>
                <Text color="dimmed">{user.bio ? user.bio.slice(0, 64) : 'No bio'}</Text>
              </Stack>
            </Group>
          ) : (
            <Skeleton>
              <Group>
                <Avatar size="xl" radius={999} />
                <Stack spacing={0}>
                  <Text size="xl" weight="bold">
                    Placeholder
                  </Text>
                  <Text>Placeholder</Text>
                  <Text color="dimmed">Placeholder</Text>
                </Stack>
              </Group>
            </Skeleton>
          )}
          <Stack spacing={5}>
            <Group position="apart">
              <Text size="xl" weight="bold">
                Total Balance:
              </Text>
              <Group>
                <Text size="xl" weight="bold">
                  {formatBalance(balance, 6)}
                </Text>
                <Image src="images/token.svg" alt="token" width="25px" />
              </Group>
            </Group>
            <Text color="dimmed">{account}</Text>
          </Stack>
        </Group>
        {events && (
          <Stack mt="xl">
            {events.map(
              (event, i) =>
                event.type &&
                supported.includes(event.type) && <Activity key={i} event={event as GithubEvent} />
            )}
          </Stack>
        )}
      </Card>
    </>
  );
}
