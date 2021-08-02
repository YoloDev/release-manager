import * as core from '@actions/core';
import { Octokit } from '@octokit/action';

async function run(): Promise<void> {
  try {
    const label: string = core.getInput('label');
    core.info(`Checking that label ${label} exists`);

    const GITHUB_REPOSITORY = process.env.GITHUB_REPOSITORY;
    if (!GITHUB_REPOSITORY) {
      throw new Error(`env.GITHUB_REPOSITORY not set`);
    }

    const octokit = new Octokit();
    const [owner, repo] = GITHUB_REPOSITORY.split('/');

    await octokit.issues.createLabel({
      owner,
      repo,
      name: label,
    });
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
