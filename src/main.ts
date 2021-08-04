import * as core from '@actions/core';
import * as label from './label';
import * as prs from './prs';
import * as releases from './releases';
import * as changelog from './changelog';
import createContext from './context';

async function run(): Promise<void> {
  try {
    const context = createContext();

    const lastRelease = await releases.findReleaseRef(context);
    const rangeSpec = `${lastRelease}..${context.ref}`;
    const _changeLog = await changelog.run(
      context.gitChangelogVersion,
      rangeSpec,
    );

    await label.ensureLabel(context);
    const pr = await prs.findReleasePr(context);
    if (pr === null) {
      // TODO: git add . && git commit to ${branch} && git push && create PR
    } else {
      // TODO: git add . && git commit to ${branch} && git push && update PR
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
