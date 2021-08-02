import * as core from '@actions/core';
import { Octokit as ActionsOctokit } from '@octokit/action';
import { Octokit } from '@octokit/rest';
import { RequestError } from '@octokit/request-error';

async function run(): Promise<void> {
  try {
    const label = core.getInput('label');
    const dryRun = core.getBooleanInput('dry-run');

    const GITHUB_REPOSITORY = process.env.GITHUB_REPOSITORY;
    if (!GITHUB_REPOSITORY) {
      throw new Error(`env.GITHUB_REPOSITORY not set`);
    }

    const octokit: Octokit = new ActionsOctokit();
    const [owner, repo] = GITHUB_REPOSITORY.split('/');

    core.info(`Checking that label ${label} exists`);
    const labelExists = await checkLabel(octokit, owner, repo, label);

    if (!labelExists) {
      if (dryRun) core.info(`Would create label '${label}'.`);
      else await createLabel(octokit, owner, repo, label);
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

async function checkLabel(
  octokit: Octokit,
  owner: string,
  repo: string,
  label: string,
): Promise<boolean> {
  core.info(`Checking that label ${label} exists`);

  try {
    await octokit.issues.getLabel({
      owner,
      repo,
      name: label,
    });
    return true;
  } catch (e) {
    if (e instanceof RequestError) {
      if (e.status !== 404) {
        return false;
      }
    }

    throw e;
  }
}

async function createLabel(
  octokit: Octokit,
  owner: string,
  repo: string,
  label: string,
): Promise<void> {
  await octokit.issues.createLabel({
    owner,
    repo,
    name: label,
  });

  core.info(`Label '${label}' created.`);
}

run();
