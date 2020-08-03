import * as fs from 'fs';
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

        const commentBody = buildComment(getModifiedModules());

        await client.issues.createComment({
            ...context.repo,
            issue_number: context.payload.pull_request!.number,
            body: commentBody
        })
    } catch (e) {
        core.setFailed(e.message)
    }
}

function getCommentsJson(): any {
    const checklistPath = core.getInput("checklist_path")
    return JSON.parse(fs.readFileSync(checklistPath, 'utf-8'))
}

function getModifiedModules(): Array<string> {
    const modifiedModules = ['all'];
    const modifiedModulesStr = core.getInput("modified_modules")
    JSON.parse(modifiedModulesStr).forEach((m: string) => modifiedModules.push(m))
    return modifiedModules;
}

function buildComment(modifiedModules: Array<string>): string {
    const checklist = getCommentsJson()
    console.log(checklist);
    let commentBody = "";

    for (const module of modifiedModules) {
        console.log("Checking module " + module);
        if (module in checklist) {
            console.log("Is in list!");
            for (const check of checklist[module]) {
                console.log("Adding check!");
                commentBody += `- [ ] ${check}\n`
            }
        }
    }
    return commentBody
}

run()
