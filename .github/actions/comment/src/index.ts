import * as core from '@actions/core'
import * as github from '@actions/github'
import {GitHub} from '@actions/github/lib/utils'

async function run(): Promise<void> {
    try {
        const context = github.context
        if (context.eventName !== 'pull_request') {
            core.setFailed('Not a Pull Request, this action only supports PRs')
        }
        const token = core.getInput('token')
        const client: InstanceType<typeof GitHub> = github.getOctokit(token)

        if (!context.payload.pull_request) {
            core.setFailed("No pull request found in the context");
        }

        await client.issues.createComment({
            ...context.repo,
            issue_number: context.payload.pull_request!.number,
            body: 'Way to go Bob!'
        })
    } catch (e) {
        core.setFailed(e.message)
    }
}

run()
