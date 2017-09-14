'use babel';

import { CompositeDisposable, File } from 'atom';
import path from 'path';

export default {
  subscriptions: null,

  activate(state) {
    this.subscriptions = new CompositeDisposable();

    this.subscriptions.add(
      atom.commands.add('atom-workspace', {
        'pickaxe:open-gemfile': () => this.openGemfile()
      })
    );
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  openGemfile() {
    for (let directory of atom.project.getDirectories()) {
      let gemfilePath = path.join(directory.getPath(), 'Gemfile');
      let gemfile = new File(gemfilePath, false);

      if (gemfile.existsSync()) return atom.workspace.open(gemfilePath);
    }

    atom.notifications.addWarning('Gemfile not found!');
  }
};
