import {exec, getExecOutput} from "@actions/exec";

async function livecheck(package_name: string) {
    const livecheck_result = await getExecOutput(
        "brew",
        ["livecheck",
            "--newer-only",
            "--casks",
            "--full-name",
            "--json",
            package_name
        ])
    if (livecheck_result.exitCode !== 0) {
        throw Error(`livecheck ${package_name} failed: ${livecheck_result.stderr}`)
    }
    const data = JSON.parse(livecheck_result.stdout.toString())
    if (data.length === 0) {
        return
    }
    return data[0].version.latest;
}

async function brew_cask_pr(
    package_name: string,
    latest_version: string,
    token: string,
    message: string
) {
    if (!process.env['HOMEBREW_GITHUB_API_TOKEN']) {
        process.env['HOMEBREW_GITHUB_API_TOKEN'] = token;
    }
    const cask_bumping_command = [
        "bump-cask-pr",
        "--verbose",
        "--online",
        "--no-browse",
    ];
    if (message) {
        cask_bumping_command.concat(['--message', message]);
    }
    cask_bumping_command.concat(["--version", latest_version, package_name]);
    const bump_cask_pr_result = await exec(
        "brew",
        cask_bumping_command,
        {
            listeners: {
                stderr: () => process.stderr,
                stdout: () => process.stdout,
            }
        }
    )
    if (bump_cask_pr_result !== 0) {
        throw Error(`bump-cask-pr ${package_name}:${latest_version} failed!`)
    }
}

export async function livecheck_and_bumping_cask_pr(package_name: string, token: string, message: string) {
    try {
        const package_latest_version = await livecheck(package_name);
        if (package_latest_version === null) {
            return
        }
        await brew_cask_pr(package_name, package_latest_version, token, message)
    } catch (error) {
        console.error(error.message)
    }
}
