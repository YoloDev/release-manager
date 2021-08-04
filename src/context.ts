import { Octokit } from '@octokit/rest';
import * as core from '@actions/core';
import { Octokit as ActionsOctokit } from '@octokit/action';

export type Context = {
  readonly octokit: Octokit;
  readonly owner: string;
  readonly repo: string;
  readonly label: string;
  readonly branch: string;
  readonly gitChangelogVersion: string;
  readonly lastRelease: string | null;
  readonly ref: string;
  readonly dryRun: boolean;
};

const create = (): Context => {
  const label = core.getInput('label', { required: true });
  const branch = core.getInput('branch', { required: true });
  const dryRun = core.getBooleanInput('dry-run');
  const gitChangelogVersion = core.getInput('git-changelog-version');
  const lastRelease = core.getInput('last-release') || null;
  const ref = core.getInput('ref', { required: true });

  const GITHUB_REPOSITORY = process.env.GITHUB_REPOSITORY;
  if (!GITHUB_REPOSITORY) {
    throw new Error(`env.GITHUB_REPOSITORY not set`);
  }

  const octokit: Octokit = new ActionsOctokit({});
  const [owner, repo] = GITHUB_REPOSITORY.split('/');

  return Object.freeze({
    octokit,
    owner,
    repo,
    label,
    branch,
    gitChangelogVersion,
    lastRelease,
    ref,
    dryRun,
  });
};

export default create;
