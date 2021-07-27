import {getOctokit} from "@actions/github";

export async function fetch_user_info(name: string, token: string) {
    const client = getOctokit(token);
    return await client.rest.users.getByUsername({username: name})
}
