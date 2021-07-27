import {getInput, setFailed} from '@actions/core';
import {getOctokit, context} from '@actions/github';
import {livecheck_and_bumping_cask_pr} from "./src/homebrew";
import {isMacOs, set_git_user} from "./src/utils";
import axios from "axios";
import {fetch_user_info} from "./src/github";

async function package_process(package_name, bump_gist_raw_link) {
    if (bump_gist_raw_link) {
        let resp = await axios.get(bump_gist_raw_link)
        return Array.from(resp.data.split.map(item => item.trim()))
    } else {
        return [package_name]
    }
}

async function main() {
    try {
        const token = getInput('token');
        const email = getInput('email');
        const name = getInput('name');
        const package_name = getInput('package');
        const bump_gist_raw_link = getInput('bump-gist-raw-link')
        const message = getInput('message')

        if (!await isMacOs()) {
            throw Error("macOS for this action is needed!")
        }

        const user = await fetch_user_info(name, token);
        const git_name: string = String(name || user.data.name || user.data.login)
        const git_email: string = String(email || user.data.email || user.data.id + "+" + user.data.login + "@users.noreply.github.com")

        await set_git_user(git_name, git_email)
        for (const pkg in await package_process(package_name, bump_gist_raw_link)) {
            if (pkg === null) {
                continue
            }
            await livecheck_and_bumping_cask_pr(pkg, token, message);
        }

        const payload = JSON.stringify(context.payload, undefined, 2)
        console.log(`The event payload: ${payload}`);
    } catch (error) {
        setFailed(error.message);
    }
}

main()
