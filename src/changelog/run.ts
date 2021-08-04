import * as core from '@actions/core';
import * as exec from '@actions/exec';
import { ensureInstalled } from './install';

export async function run(version: string, rangeSpec: string): Promise<string> {
  const toolDir = await ensureInstalled(version);
  core.addPath(toolDir);

  const result = await exec.getExecOutput('git-changelog', [rangeSpec]);
  if (result.exitCode !== 0)
    throw new Error(`git-changelog returned exit code ${result.exitCode}`);

  return result.stdout;
}
