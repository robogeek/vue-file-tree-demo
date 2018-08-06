<template>
  <div id="wrapper" class="columns is-gapless is-mobile">
    <file-browser-tree 
          id="file-tree"
          ref="filetree"
          class="column"
          @nodeClick="nodeClick"
          @nodeDoubleClick="nodeDoubleClick"
          @nodeDrop="nodeDrop">

    <template slot="context-menu">
        <div @click="doDashboard">Dashboard</div>
        <div @click="doCustomers">Customers</div>
    </template>

    </file-browser-tree>

    <div id="file-info-view" class="column">
        <span v-html="fileInfo"></span>
        <button class="button is-primary" @click="rescan">Rescan</button>
    </div>
  </div>
</template>

<script>

// import Vue from 'vue'

const path = require('path');
const util = require('util');
import { messageBus } from '../main.js';
import { ipcRenderer } from 'electron';

// import FileBrowserTree from './FileBrowserTree.vue';

import FileBrowserTree from 'vue-file-tree'; // './FileBrowserTree.vue';
// Vue.component('file-browser-tree', FileBrowserTree);

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
  name: 'file-browser-main',
  components: {
    'file-browser-tree': FileBrowserTree,
  },
  data() {
    return {
      fileInfo: "",
      nodes: []
    }
  },
  methods: {
    nodeClick(event, node) {
      console.log(`nodeClick ${util.inspect(node)}`)
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
    doCustomers() {
        console.log(`doCustomers`);
        this.$refs.filetree.contextMenuIsVisible = false;
    },
    doDashboard() {
        console.log(`doDashboard`);
        this.$refs.filetree.contextMenuIsVisible = false;
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
