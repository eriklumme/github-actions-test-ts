import * as core from '@actions/core'
import * as github from '@actions/github'
import {GitHub} from '@actions/github/lib/utils'

async function run(): Promise<void> {
  try {
    const context = github.context
    if (context.eventName !== 'pull_request') {
      core.setFailed('Not a Pull Request, this action only supports PRs');
    }
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
      const firstSlashIndex = filename.indexOf("/");
      if (firstSlashIndex !== -1) {
        modifiedModules.add(filename.substring(0, firstSlashIndex));
      }
    }

    // Spreading into array, as JSON doesn't work well with Sets out of the box
    const modifiedModulesJSON = JSON.stringify([...modifiedModules]);

    console.log(`Setting output modified_modules to: ${modifiedModulesJSON}`);
    core.setOutput("modified_modules", modifiedModulesJSON);
  } catch (e) {
    core.setFailed(e.message)
  }
}

run()
