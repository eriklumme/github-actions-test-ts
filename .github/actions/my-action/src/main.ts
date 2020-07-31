import * as core from '@actions/core'
import * as github from '@actions/github'
import {GitHub} from '@actions/github/lib/utils'

async function run(): Promise<void> {
  try {
    const context = github.context
    if (context.eventName !== 'pull_request') {
      core.setFailed('Not a Pull Request, this action only supports PRs');
    }
    const modules = new Set(core.getInput('modules').split(',').map(str => str.trim()));
    const token = core.getInput('token')
    const client: InstanceType<typeof GitHub> = github.getOctokit(token)

    const response = await client.repos.compareCommits({
      head: context.payload.pull_request?.head?.sha,
      base: context.payload.pull_request?.base?.sha,
      owner: context.repo.owner,
      repo: context.repo.repo
    })

    if (response.status !== 200) {
      core.setFailed(`The GitHub API returned an unexpected status ${response.status}`)
    }

    const modifiedModules: Set<string> = new Set();

    for (const file of response.data.files) {
      const filename = file.filename;
      for (const module of modules) {
        if (filename.startsWith(module)) {
          modifiedModules.add(module);
          modules.delete(module);
          break;
        }
      }
      if (modules.size === 0) {
        break;
      }
    }
    const pullRequest = github.context.payload

    console.log(modifiedModules)
  } catch (e) {
    core.setFailed(e.message)
  }
}

run()
