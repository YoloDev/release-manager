import * as core from '@actions/core';
import { Context } from './context';
import { Endpoints } from '@octokit/types';
// import { RequestError } from '@octokit/request-error';

export type Issue = Endpoints['GET /repos/{owner}/{repo}/issues/{issue_number}']['response']['data'];

export async function findReleaseIssue(
  context: Context,
): Promise<Issue | null> {
  const { octokit, owner, repo, label } = context;
  core.info(`Looking for open issues with label '${label}'.`);

  const issuesResponse = await octokit.issues.listForRepo({
    owner,
    repo,
    labels: label,
    state: 'open',
    sort: 'created',
    direction: 'desc',
    per_page: 2,
  });

  const issues = issuesResponse.data;
  if (issues.length === 0) {
    core.info(`No open release issue found.`);
    return null;
  }

  if (issues.length > 1) {
    core.warning(
      `More than one open release issue found - using the one created most recently.`,
    );
  }

  return issues[0];
}
