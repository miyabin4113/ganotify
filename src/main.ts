import * as core from '@actions/core'
import {Slack} from './slack'
import {validateStatus} from './utils'

async function run() {
  try {
    const type: string = core.getInput('type', {required: true})
    const job_name: string = core.getInput('job_name', {required: true})
    const username: string = core.getInput('username') || 'GitHub Actions'
    const icon_emoji: string = core.getInput('icon_emoji') || 'github'

    const SLACK_WEBHOOK: string = process.env.SLACK_WEBHOOK || ''

    if (SLACK_WEBHOOK === '') {
      throw new Error(
        'ERROR: Missing "SLACK_WEBHOOK"\nPlease configure "SLACK_WEBHOOK" as environment variable'
      )
    }

    const status = validateStatus(type)
    const slack = new Slack(SLACK_WEBHOOK, username, icon_emoji)
    const result = await slack.notify(status, job_name)

    core.debug(`Response from Slack: ${JSON.stringify(result)}`)
  } catch (err) {
    console.log(err)
    core.setFailed(err.message)
  }
}

run()
