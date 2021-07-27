import { exec, getExecOutput } from '@actions/exec'

async function getUnameInfo() {
  const execOutput = await getExecOutput('uname')
  if (execOutput.exitCode !== 0) {
    throw new Error('Command `uname` is not support in this system.')
  }
  return execOutput.stdout.toString().trim()
}

export async function isMacOs() {
  const unameInfo = await getUnameInfo()
  return unameInfo.toLowerCase() === 'darwin'
}

export async function setGitUser(name: string, email: string) {
  await exec('git', ['config', '--global', 'user.name', name])
  await exec('git', ['config', '--global', 'user.email', email])
}
