import { getInput, setFailed } from '@actions/core'
import { context } from '@actions/github'
import axios from 'axios'
import { livecheckAndBumpingCaskPr } from './homebrew'
import { isMacOs, setGitUser } from './utils'
import { fetchUserInfo } from './github'

async function packageProcess(
  package_name: string,
  bump_gist_raw_link: string,
) {
  if (bump_gist_raw_link) {
    const resp = await axios.get(bump_gist_raw_link)
    return Array.from(
      resp.data
        .toString()
        .split()
        .map((item: string) => item.trim()),
    )
  }
  return [package_name]
}

async function main() {
  try {
    const token = getInput('token')
    const email = getInput('email')
    const name = getInput('name')
    const packageName = getInput('package')
    const bumpGistRawLink = getInput('bump-gist-raw-link')
    const message = getInput('message')

    if (!(await isMacOs())) {
      throw Error('macOS for this action is needed!')
    }

    const user = await fetchUserInfo(name, token)
    const gitName = String(name || user.data.name || user.data.login)
    const gitEmail = String(
      email ||
        user.data.email ||
        `${user.data.id}+${user.data.login}@users.noreply.github.com`,
    )

    await setGitUser(gitName, gitEmail)
    for (const pkg of await packageProcess(packageName, bumpGistRawLink)) {
      if (pkg !== null && typeof pkg === 'string') {
        await livecheckAndBumpingCaskPr(pkg, token, message)
      }
    }

    const payload = JSON.stringify(context.payload, undefined, 2)
    console.log(`The event payload: ${payload}.`)
  } catch (error) {
    setFailed(error.message)
  }
}

main()
