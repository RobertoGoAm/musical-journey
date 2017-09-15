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
    for (let directory of atom.project.getDirectories()) {
      let filePath = path.join(directory.getPath(), filename);
      let file = new File(filePath, false);

      if (file.existsSync()) return atom.workspace.open(filename);
    }

    atom.notifications.addWarning(`${filename} not found!`);
  }
};
