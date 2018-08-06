<template>
    <span>
    <sl-vue-tree
           id="file-tree"
           ref="slvuetree"
           :value="nodes"
           :allowMultiselect="false"
           @nodeclick="nodeClick"
           @nodedblclick="nodeDoubleClick"
           @select="nodeSelect"
           @toggle="nodeToggle"
           @drop="nodeDrop"
           @nodecontextmenu="nodeContextMenu"
           @externaldrop.prevent="onExternalDropHandler">

      <template slot="toggle" slot-scope="{ node }">
          <span v-if="!node.isLeaf">
            <font-awesome-icon 
                icon="caret-right" 
                v-if="!node.isExpanded"></font-awesome-icon>
            <font-awesome-icon 
                icon="caret-down"
                v-else-if="node.isExpanded"></font-awesome-icon>
          </span>
      </template>

      <template slot="title" slot-scope="{ node }">
          <font-awesome-icon 
                :icon="[ 'fab', 'js' ]" 
                v-if='node.data.type === "application/javascript"'></font-awesome-icon>
          <font-awesome-icon 
                icon="table" 
                v-else-if='node.data.type === "application/json"'></font-awesome-icon>
          <font-awesome-icon 
                icon="image" 
                v-else-if='node.data.type === "IMAGE"'></font-awesome-icon>
          <font-awesome-icon 
                icon="code" 
                v-else-if='node.data.type === "EJS"'></font-awesome-icon>
          <font-awesome-icon 
                :icon="[ 'fab', 'vuejs' ]" 
                v-else-if='node.data.type === "VUEJS"'></font-awesome-icon>
          <font-awesome-icon 
                :icon="[ 'fab', 'java' ]" 
                v-else-if='node.data.type === "JAVA"'></font-awesome-icon>
          <font-awesome-icon 
                :icon="[ 'fab', 'php' ]" 
                v-else-if='node.data.type === "PHP"'></font-awesome-icon>
          <font-awesome-icon 
                :icon="[ 'fab', 'python' ]" 
                v-else-if='node.data.type === "PYTHON"'></font-awesome-icon>
          <font-awesome-icon 
                :icon="[ 'fab', 'css3' ]" 
                v-else-if='node.data.type === "CSS"'></font-awesome-icon>
          <font-awesome-icon 
                :icon="[ 'fab', 'markdown' ]" 
                v-else-if='node.data.type === "MARKDOWN"'></font-awesome-icon>
          <font-awesome-icon 
                icon="file" 
                v-else-if="node.isLeaf"></font-awesome-icon>
           {{ node.title }} </template>


      <template slot="sidebar" slot-scope="{ node }">
          <font-awesome-icon 
                icon="circle" 
                v-if="node.data.isModified"></font-awesome-icon>
      </template>
    </sl-vue-tree>

    <aside class="menu contextmenu" 
            ref="contextmenu" 
            v-show="contextMenuIsVisible">
        <div @click="doDashboard">Dashboard</div>
        <div @click="doCustomers">Customers</div>
    </aside>

    <!-- 
    <b-dropdown class="contextmenu" 
            ref="contextmenu" 
            v-show="contextMenuIsVisible">

            <b-dropdown-item @click="doDashboard">Dashboard</b-dropdown-item>
            <b-dropdown-item @click="doCustomers">Customers</b-dropdown-item>
    </b-dropdown>
    -->
    </span>
</template>

<script>

// import Vue from 'vue';

const pd = require('path-directories');
const path = require('path');
const util = require('util');

import mime from 'mime';

import slVueTree from 'sl-vue-tree';
import 'sl-vue-tree/dist/sl-vue-tree-dark.css';

import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faCaretRight, faCaretDown, faTable, faImage, faFile, faCircle, faCode
} from '@fortawesome/free-solid-svg-icons';
import { faJs, faVuejs } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { systemPreferences } from 'electron';

library.add(faJs, faVuejs, faCaretRight, faCaretDown, faTable, faImage, faFile, faCircle, faCode);

// TODO: Prevent dragging a file into a place where there's already one of the same name
//       In such a case ask the user what to do?  How?

// TODO: Support copy/paste

// TODO: Support right-click menu

// TODO: Support delete

// TODO: move to own project -- publish as npm package

export default {

    data() {
        return {
            nodes: [],
            contextMenuIsVisible: false
        }
    },
    components: {
        'sl-vue-tree': slVueTree,
        'font-awesome-icon': FontAwesomeIcon
    },
    created() {
        /*
         * Derived from Buefy's b-dropdown
         * https://github.com/buefy/buefy/blob/dev/src/components/dropdown/Dropdown.vue
         */
        if (typeof window !== 'undefined') {
            document.addEventListener('click', this.clickedOutside)
        }
    },
    methods: {
        nodeClick(node, event) {
            this.$emit('nodeClick', event, node);
        },
        nodeDoubleClick(node, event) {
            console.log(`nodeDoubleClick ${node.title} ${node.data.type} isLeaf ${node.isLeaf} ${util.inspect(node)}`);
            if (!node.isLeaf) {
                this.$refs.slvuetree.onToggleHandler(event, node);
                return;
            }
            this.$emit('nodeDoubleClick', node);
        },
        nodeSelect(node) {
            console.log(`nodeSelect ${util.inspect(node)}`);
        },
        nodeToggle(node) {
            console.log(`nodeToggle ${util.inspect(node)}`);
        },
        nodeDrop(node, event) {
            console.log(`nodeDrop ${util.inspect(node)}`);
            this.$emit('nodeDrop', event, node);
        },
        nodeContextMenu(node, event) {
            console.log(`nodeContextMenu ${util.inspect(node)}`);
            this.contextMenuIsVisible = true;
            const $contextMenu = this.$refs.contextmenu;
            $contextMenu.style.left = event.clientX + 'px';
            $contextMenu.style.top = event.clientY + 'px';
        },
        /**
         * Close dropdown if clicked outside.
         * Derived from Buefy's b-dropdown
         * https://github.com/buefy/buefy/blob/dev/src/components/dropdown/Dropdown.vue
         */
        clickedOutside(event) {
            if (!this.isInWhiteList(event.target)) this.contextMenuIsVisible = false;
        },
        // If the "clickOutside" is on a target where we should ignore the click
        // then we should ignore this.  
        // See: https://github.com/buefy/buefy/blob/dev/src/components/dropdown/Dropdown.vue
        isInWhiteList(el) { return false; },
        onExternalDropHandler(cursorPosition, event) {
            console.log('external drop', cursorPosition, util.inspect(event));
        },
        doCustomers() {
            console.log(`doCustomers`);
            this.contextMenuIsVisible = false;
        },
        doDashboard() {
            console.log(`doDashboard`);
            this.contextMenuIsVisible = false;
        },
        addPathToTree(fn, stat, isDir) {
            console.log(`FileBrowserTree addPathToTree ${fn} ${util.inspect(stat)} ${isDir}`);
            console.log(`addPathToTree ${fn}`);
            fn = path.normalize(fn);
            const basenm = path.basename(fn);

            const dirs = pd(fn);
            console.log(`addPathToTree dirs ${util.inspect(dirs)}`);
            let curnodes = this.nodes;
            for (let dir of dirs) {
                if (dir === '.') continue;
                let found = undefined;
                for (let cur of curnodes) {
                    if (cur.isLeaf === false && cur.title === dir) {
                        found = cur;
                        break;
                    }
                }
                if (!found) {
                    let newnode = {
                        title: dir, 
                        isLeaf: false, 
                        children: [], 
                        data: { 
                            type: "DIRECTORY",
                            pathname: fn, 
                            stat 
                        }
                    };
                    curnodes.push(newnode);
                    curnodes = newnode.children;
                } else {
                    curnodes = found.children;
                }
            }
            let newnode = {
                title: basenm, 
                isLeaf: !isDir, 
                data: { 
                    type: mime.getType(fn),
                    pathname: fn,
                    stat
                }
            };
            if (!newnode.data.type) newnode.data.type = "text/plain";
            if (newnode.data.type.startsWith('image/')) newnode.data.type = "IMAGE";
            if (fn.endsWith('.ts')) newnode.data.type = "application/javascript";
            if (fn.endsWith('.ejs')) newnode.data.type = "EJS";
            if (fn.endsWith('.vue')) newnode.data.type = "VUEJS";
            if (fn.endsWith('.java')) newnode.data.type = "JAVA";
            if (fn.endsWith('.php')) newnode.data.type = "PHP";
            if (fn.endsWith('.py')) newnode.data.type = "PYTHON";
            if (fn.endsWith('.css')) newnode.data.type = "CSS";
            if (fn.endsWith('.md')) newnode.data.type = "MARKDOWN";
            if (!newnode.isLeaf) newnode.children = [];
            curnodes.push(newnode);
        }
    }
}

</script>

<style scoped>

.contextmenu {
    position: absolute;
    background-color: white;
    color: black;
    border-radius: 2px;
    cursor: pointer;
}

.contextmenu > div {
    padding: 10px;
}

.contextmenu > div:hover {
    background-color: rgba(100, 100, 255, 0.5);
}

</style>