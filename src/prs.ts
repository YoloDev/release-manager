import * as core from '@actions/core';
import { Context } from './context';
import { Endpoints } from '@octokit/types';

export type PullRequest =
  Endpoints['GET /repos/{owner}/{repo}/pulls']['response']['data'][0];

export async function findReleasePr(
  context: Context,
): Promise<PullRequest | null> {
  const { octokit, owner, repo, branch } = context;
  core.info(`Looking for open PR with branch '${branch}'.`);

  const prsResponse = await octokit.pulls.list({
    owner,
    repo,
    head: `${owner}:${branch}`,
    state: 'open',
    sort: 'created',
    direction: 'desc',
    per_page: 2,
  });

  const prs = prsResponse.data;
  if (prs.length === 0) {
    core.info(`No open release pr found.`);
    return null;
  }

  if (prs.length > 1) {
    core.warning(
      `More than one open release pr found - using the one created most recently.`,
    );
  }

  return prs[0];
}
