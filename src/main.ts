import * as core from '@actions/core';
import * as label from './label';
import * as issues from './issue';
import createContext from './context';

async function run(): Promise<void> {
  try {
    const context = createContext();

    await label.ensureLabel(context);
    await issues.findReleaseIssue(context);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
