<template>
  <div id="wrapper" class="columns is-gapless is-mobile">
    <file-browser-tree 
          id="file-tree"
          ref="filetree"
          class="column"
          @nodeClick="nodeClick"
          @nodeDoubleClick="nodeDoubleClick"
          @nodeDrop="nodeDrop"></file-browser-tree>

    <div id="file-info-view" class="column">
        <span v-html="fileInfo"></span>
        <button class="button is-primary" @click="rescan">Rescan</button>
    </div>
  </div>
</template>

<script>

const path = require('path');
const util = require('util');
import { messageBus } from '../main.js';
import { ipcRenderer } from 'electron';

/* var nodes = [
    {title: 'Item1', isLeaf: true},
    {title: 'Item2', isLeaf: true, data: { visible: false }},
    {title: 'Folder1'},
    {
      title: 'Folder2', isExpanded: true, children: [
        {title: 'Item3', isLeaf: true},
        {title: 'Item4', isLeaf: true, data: { isModified: true }}
      ]
    }
]; */

export default {
  name: 'landing-page',
  components: {
    // fileBrowserTree: FileBrowserTree
  },
  data() {
    return {
      fileInfo: "",
      nodes: []
    }
  },
  methods: {
    nodeClick(node) {
      this.fileInfo = `
        <table>
        <tr><th>ACTION</th><th>CLICK</th></tr>
        <tr><th>Filename</th><td>${node.data.pathname}</td></tr>
        <tr><th>Created</th><td>${node.data.stat.ctime}</td></tr>
        <tr><th>Access</th><td>${node.data.stat.atime}</td></tr>
        <tr><th>Modified</th><td>${node.data.stat.mtime}</td></tr>
        <tr><th>Size</th><td>${node.data.stat.size}</td></tr>
        <tr><th>Mode</th><td>${node.data.stat.mode}</td></tr>
        </table>
        `;
    },
    nodeDoubleClick(node) {
      this.fileInfo = `
        <table>
        <tr><th>ACTION</th><th>DOUBLE-CLICK</th></tr>
        <tr><th>Filename</th><td>${node.data.pathname}</td></tr>
        <tr><th>Created</th><td>${node.data.stat.ctime}</td></tr>
        <tr><th>Access</th><td>${node.data.stat.atime}</td></tr>
        <tr><th>Modified</th><td>${node.data.stat.mtime}</td></tr>
        <tr><th>Size</th><td>${node.data.stat.size}</td></tr>
        <tr><th>Mode</th><td>${node.data.stat.mode}</td></tr>
        </table>
        `;
    },
    nodeDrop(node) {
      this.fileInfo = `
        <table>
        <tr><th>ACTION</th><th>DROP</th></tr>
        <tr><th>Filename</th><td>${node[0].data.pathname}</td></tr>
        <tr><th>Created</th><td>${node[0].data.stat.ctime}</td></tr>
        <tr><th>Access</th><td>${node[0].data.stat.atime}</td></tr>
        <tr><th>Modified</th><td>${node[0].data.stat.mtime}</td></tr>
        <tr><th>Size</th><td>${node[0].data.stat.size}</td></tr>
        <tr><th>Mode</th><td>${node[0].data.stat.mode}</td></tr>
        </table>
        `;
    },
    rescan() {
      this.nodes = [];
      ipcRenderer.send('rescan-directory');
    }
  },
  created: function() {
    console.log(util.inspect(path));
      messageBus.$on('file', (fn, stat) => { 
        this.$refs.filetree.addPathToTree(fn, stat, false);
      });
      messageBus.$on('directory', (fn, stat) => { 
        this.$refs.filetree.addPathToTree(fn, stat, true);
      });
  }
}
</script>

<style>
  @import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body { font-family: 'Source Sans Pro', sans-serif; }

  #wrapper {
    height: 100vh;
    width: 100vw;
  }

  #file-tree, #file-info-view {
    height: 100%;
    overflow: scroll;
  }

</style>
