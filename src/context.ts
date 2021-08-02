import { Octokit } from '@octokit/rest';
import * as core from '@actions/core';
import { Octokit as ActionsOctokit } from '@octokit/action';

export type Context = {
  readonly octokit: Octokit;
  readonly owner: string;
  readonly repo: string;
  readonly label: string;
  readonly dryRun: boolean;
};

const create = (): Context => {
  const label = core.getInput('label');
  const dryRun = core.getBooleanInput('dry-run');

  const GITHUB_REPOSITORY = process.env.GITHUB_REPOSITORY;
  if (!GITHUB_REPOSITORY) {
    throw new Error(`env.GITHUB_REPOSITORY not set`);
  }

  const octokit: Octokit = new ActionsOctokit({});
  const [owner, repo] = GITHUB_REPOSITORY.split('/');

  return Object.freeze({ octokit, owner, repo, label, dryRun });
};

export default create;
