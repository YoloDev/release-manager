import * as core from '@actions/core';
import { Context } from './context';
import { Endpoints } from '@octokit/types';

export type Release =
  Endpoints['GET /repos/{owner}/{repo}/releases']['response']['data'][0];

export async function findReleaseRef(context: Context): Promise<string | null> {
  const { lastRelease } = context;
  if (lastRelease !== null) {
    core.info(`last-release set, using '${lastRelease}'...`);
    return lastRelease;
  } else {
    core.info(`Looking for release`);
    const release = await findLatestRelease(context);
    if (release === null) return null;
    return release.target_commitish;
  }
}

async function findLatestRelease(context: Context): Promise<Release | null> {
  const { octokit, owner, repo } = context;

  try {
    const release = await octokit.repos.getLatestRelease({ owner, repo });
    return release.data;
  } catch (e) {
    if (e && e.status === 404) {
      return null;
    }

    throw e;
  }
}
