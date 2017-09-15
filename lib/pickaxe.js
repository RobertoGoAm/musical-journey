'use babel';

import { CompositeDisposable, File } from 'atom';
import path from 'path';

export default {
  subscriptions: null,

  activate(state) {
    this.subscriptions = new CompositeDisposable();

    this.subscriptions.add(
      atom.commands.add('atom-workspace', {
        'pickaxe:open-gemfile': () => this.openRootFile('Gemfile'),
        'pickaxe:open-guardfile': () => this.openRootFile('GuardFile')
      })
    );
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  /**
   * @summary Open a file located in the root directory of the project.
   *
   * This function tries to look for the current active file's root project
   * path and then looks for a file to open that matches the filename parameter.
   * If theres no open file it will open the first one matching the filename
   * parameter in one of the roots of the current project
   *
   * @param String filename name of the file to open.
   */
  openRootFile(filename) {
    const activeEditor = atom.workspace.getActiveTextEditor();

    if (activeEditor.buffer.file) {
      const activeFilePath = activeEditor.buffer.file.path;
      const projectRoot = atom.project.relativizePath(activeFilePath)[0];

      if (checkFileAndOpen(projectRoot, fileName)) return;

      atom.notifications.addWarning(`${filename} not found!`);
    } else {
      for (let directory of atom.project.getDirectories()) {
        let filePath = directory.getPath();

        if (checkFileAndOpen(filePath, fileName)) return;
      }

      atom.notifications.addWarning(`${filename} not found!`);
    }
  },

  /**
   * @summary Checks that a file exists and tries to open it.
   *
   * Checks if a file exists using both parameters. If it does it will open the
   * the file and return true so the function using it knows it found the file.
   * If it doesn't it just returns false.
   *
   * @param String filePath directory of the file to check.
   * @param String fileName name of the file to check and open.
   */
  checkFileAndOpen(filePath, fileName) {
    const fullPath = path.join(filePath, fileName);
    const file = new File(fullPath, false);

    if (file.existsSync()) {
      atom.workspace.open(fullPath);
      return true;
    } else {
      return false;
    }
  }
};
