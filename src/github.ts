import { getOctokit } from '@actions/github'

export async function fetchUserInfo(name: string, token: string) {
  const client = getOctokit(token)
  const user = await client.rest.users.getByUsername({ username: name })
  return user
}
