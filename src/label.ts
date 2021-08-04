import * as core from '@actions/core';
import { Context } from './context';
import { RequestError } from '@octokit/request-error';

export async function ensureLabel(context: Context): Promise<void> {
  const labelExists = await checkLabel(context);

  if (!labelExists) {
    await createLabel(context);
  } else {
    core.info(`Label '${context.label}' already exists.`);
  }
}

async function checkLabel(context: Context): Promise<boolean> {
  const { octokit, owner, repo, label } = context;
  core.info(`Checking that label '${label}' exists.`);

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

async function createLabel(context: Context): Promise<void> {
  const { octokit, owner, repo, label, dryRun } = context;
  core.info(`Creating label '${label}'.`);

  if (!dryRun) {
    await octokit.issues.createLabel({
      owner,
      repo,
      name: label,
    });
  } else {
    core.info(`[dry-run]: create label '${label}'.`);
  }

  core.info(`Label '${label}' created.`);
}
