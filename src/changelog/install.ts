import * as tc from '@actions/tool-cache';
import path from 'path';

const IS_WINDOWS = process.platform === 'win32';
const IS_OSX = process.platform === 'darwin';

export async function ensureInstalled(version: string): Promise<string> {
  let toolDir = tc.find('git-changelog', version);
  if (toolDir) return toolDir;

  if (IS_WINDOWS) {
    const dlPath = await tc.downloadTool(
      `https://github.com/aldrin/git-changelog/releases/download/v${version}/git-changelog-v${version}-windows.zip`,
    );
    const dlDir = await tc.extractZip(dlPath);
    const tool = path.join(dlDir, 'target', 'release', 'git-changelog.exe');
    await tc.cacheFile(tool, 'git-changelog.exe', 'git-changelog', version);
  } else if (IS_OSX) {
    const dlPath = await tc.downloadTool(
      `https://github.com/aldrin/git-changelog/releases/download/v${version}/git-changelog-v${version}-osx.tar.gz`,
    );
    const dlDir = await tc.extractTar(dlPath);
    const tool = path.join(dlDir, 'git-changelog');
    await tc.cacheFile(tool, 'git-changelog', 'git-changelog', version);
  } else {
    const dlPath = await tc.downloadTool(
      `https://github.com/aldrin/git-changelog/releases/download/v${version}/git-changelog-v${version}-linux.tar.gz`,
    );
    const dlDir = await tc.extractTar(dlPath);
    const tool = path.join(dlDir, 'git-changelog');
    await tc.cacheFile(tool, 'git-changelog', 'git-changelog', version);
  }

  toolDir = tc.find('git-changelog', version);
  if (!toolDir) throw new Error(`Failed to install git-changelog v${version}`);
  return toolDir;
}
