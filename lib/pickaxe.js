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

  openRootFile(filename) {
    const activeEditor = atom.workspace.getActiveTextEditor();
    const activeFilePath = activeEditor.buffer.file.path;
    const projectRoot = atom.project.relativizePath(activeFilePath)[0];
    const file = new File(path.join(projectRoot, filename), false);

    if (file.existsSync()) {
      atom.workspace.open(path.join(projectRoot, filename));
    } else {
      atom.notifications.addWarning(`${filename} not found!`);
    }
  }
};
