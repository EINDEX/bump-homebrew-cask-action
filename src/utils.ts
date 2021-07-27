// check system is macOS
import {exec, getExecOutput} from "@actions/exec";

async function getUnameInfo() {
    const execOutput = await getExecOutput('uname')
    if (execOutput.exitCode != 0 || execOutput.stderr != null) {
        throw new Error("Command `uname` is not support in this system.")
    }
    return execOutput.stdout.toString().trim()
}

export async function isMacOs() {
    const unameInfo = await getUnameInfo();
    return unameInfo.toLowerCase() === "darwin";
}

export async function set_git_user(name: string, email: string) {
    // setting up git username and email
    await exec("git", ["config", "--global", "user.name", name])
    await exec("git", ["config", "--global", "user.email", email])
}
