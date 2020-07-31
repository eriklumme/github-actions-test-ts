import * as core from '@actions/core'
import * as github from '@actions/github'
import { GitHub } from '@actions/github/lib/utils';

async function run(): Promise<void> {
  try {
    const context = github.context;
    if (context.eventName !== 'pull_request') {
      console.warn("Not a Pull Request, returning.");
      return;
    }
    const token = core.getInput('token');
    const client: InstanceType<typeof GitHub> = github.getOctokit(token);

    const response = await client.repos.compareCommits({
      head: context.payload.pull_request?.head?.sha,
      base: context.payload.pull_request?.base?.sha,
      owner: context.repo.owner,
      repo: context.repo.repo
    });

    console.log(response.data.files);

    const pullRequest = github.context.payload;

    console.log(pullRequest);
  } catch (e) {
    core.setFailed(e.message)
  }
}

run()