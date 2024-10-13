class Node {
    constructor(data){
        this.data = data;
        this.left = null;
        this.right = null;
    }
}

class Tree {
    constructor(array = []) {
        this.root = this.buildTree(array);
    }

    buildTree(array) {
        const workingArray = this.sortAndFilter(array);
        return this.bstRecursive(workingArray);
    }

    sortAndFilter(array) {
        const sortedArray = array.sort((a,b) => a - b);
        const workingArray = array.filter((item, index) =>{
            return array.indexOf(item) === index;
        });
        return workingArray;
    }

    bstRecursive(array) {
        const mid = Math.floor(array.length / 2);
        const root = new Node(array[mid]);
        
        if (array.length === 0) return null;

        root.left = this.bstRecursive(array.slice(0, mid));
        root.left = this.bstRecursive(array.slice(mid + 1));

        return root;
    }

    insert(value, root = this.root) {
        if (value < root.data) {
            if(root.left) {
                this.insert(value, root.left);
            } else {
                root.left = new Node(value);
                return;
            }
        } else {
            if(root.right) {
                this.insert(value, root.right);
            } else {
                root.right = new Node(value);
                return;
            }
        }
    }

    deleteItem(value, root = this.root) {
        let deleteValue = this.find(value);
        let parentValue = this.findParent(value);
        
        if(this.isLeaf(deleteValue)) {
            if(parentValue.right === deleteValue) {
                parentValue.right = null;
            } else {
                parentValue.left = null;
            }
            return;
        }

        if(deleteValue.left && deleteValue.right){
            let compareValue = deleteValue.right;
            let parentCompareValue = deleteValue;

            while(compareValue.left !== null) {
                parentCompareValue = compareValue;
                compareValue = compareValue.left;
            }
            deleteValue.data = compareValue.left;

            if(parentCompareValue.left === compareValue) {
                parentCompareValue.left = compareValue.right;
            } else {
                parentCompareValue.right = compareValue.right;
            }
            return;
        }

        else if(deleteValue.left !== null) {
            deleteValue.data = deleteValue.left.data;
            deleteValue.left = null;
        } 

        else if(deleteValue.right !== null) {
            deleteValue.data = deleteValue.right.data;
            deleteValue.right = null;
        }
    }

    isLeaf(node) {
        return (node.left === null && node.right === null);
    }

    find(value, root = this.root) {
        if(value === root.data) {
            return root;
        } 
        
        if(value < root.data) {
            if(root.left !== null) {
                return this.find(value, root.left);
            } else {
                return null;
            }
        }
        
        if(value > root.data) {
            if(root.right !== null) {
                return this.find(value, root.right);
            } else {
                return null;
            }
        }
    }

    findParent(value, root = this.root) {
        if (root.data === value) {
            return null;
        }
        
        if(value === root.left.data || value === root.right.data) {
            return root;
        } 
        
        if(value < root.data) {
            if(root.left !== null) {
                return this.findParent(value, root.left);
            } else {
                return null;
            }
        }
        
        if(value > root.data) {
            if(root.right !== null) {
                return this.findParent(value, root.right);
            } else {
                return null;
            }
        }
    }

    levelOrder(callback, node = this.root, queue = []) {
        if(!callback) { throw new Error ("No callback"); }
        if(node === null) return;

        if(node.data !== this.root.data) { node = queue.shift(); }
        callback(node);

        if(node.left !== null) {
            queue.push(node.left);
        }
        if(node.right !== null) {
            queue.push(node.right);
        }

        if(queue.length > 0) {
            return this.levelOrder(callback, queue[0], queue);
        }

        return;
    }

    inOrder(callback, node = this.root) {
        if(!callback) { throw new Error("No Callback"); }
        if(node === null) return;
        this.inOrder(callback, node.left);
        callback(node);
        this.inOrder(callback, node.right);
    }

    preOrder(callback, node = this.root) {
        if(!callback) { throw new Error("No Callback"); }
        if(node === null) return;
        callback(node);
        this.preOrder(callback, node.left);
        this.preOrder(callback, node.right);
    }

    postOrder(callback, node = this.root) {
        if(!callback) { throw new Error("No Callback"); }
        if(node === null) return;
        this.postOrder(callback, node.left);
        this.postOrder(callback, node.right);
        callback(node.data);
    }

    depth(x, node = this.root) {
        if(node === null) return;
        let depth = 0;
        const queue = [];
        queue.push(node);

        while(queue.length > 0) {
            console.log(queue);
            const n = queue.length;
            for(let i = 0; i < n; i++) {
                let currentNode = queue.shift();
                if(currentNode.data === x) { return depth };
                if(currentNode.left) { queue.push(currentNode.left) };
                if(currentNode.right) { queue.push(currentNode.right) };
            }
            depth++;
        }
    }

    height(x, node = this.root) {
        if(node === null) return;
        let depth = 0;
        let height = 0;
        const queue = [];
        queue.push(node);

        while(queue.length > 0) {
            const n = queue.length;
            for(let i = 0; i < n; i++) {
                let currentNode = queue.shift();
                if(currentNode.data === x) { height = depth };
                if(currentNode.left) { queue.push(currentNode.left) };
                if(currentNode.right) { queue.push(currentNode.right) };
            }
            depth++;
        }
        return depth - height - 1;
    }

    isBalancedRecur(node = this.root) {
        if(node === null) return 0;

        let lh = this.isBalancedRecur(node.left);
        if (lh === -1) return -1;

        let rh = this.isBalancedRecur(node.right);
        if(rh === -1) return -1;

        if(Math.abs(lh - rh) > 1) return -1;
        return Math.max(lh, rh) + 1;
    }

    isBalanced(node = this.root) {
        if(this.isBalancedRecur(node) === -1) return false;
        return true;
    }

    rebalance() {
        if(this.isBalanced()) return;
        const vals = [];
        this.inOrder((node) => vals.push(node.data), this.root);
        this.buildTree(vals);
    }
}

const prettyPrint = (node, prefix = "", isLeft = true) => {
    if (node === null) {
      return;
    }
    if (node.right !== null) {
      prettyPrint(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
    }
    console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);
    if (node.left !== null) {
      prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
    }
}

const bst = [12, 1, 4, 7, 3, 9, 4, 13, 12, 15, 18, 22, 25, 33];
const ex = new Tree(bst);
console.log(ex.sortAndFilter(bst));
console.log(ex.root);

const randoArray = [];

const randoLength = Math.floor(Math.random() * 100);
for(let i = 0; i < randoLength; i++) {
    randoArray.push(Math.floor(Math.random() * 100));
}

console.log(randoArray);
const bst2 = new Tree(randoArray);
console.log(bst2.isBalanced());
bst2.levelOrder(console.log);
bst2.preOrder(console.log);
bst2.postOrder(console.log);
prettyPrint(bst2.root);
bst2.insert(Math.floor(Math.random() * 100) + 100);
bst2.rebalance();
console.log(bst2.isBalanced());
bst2.levelOrder(console.log);
bst2.preOrder(console.log);
bst2.postOrder(console.log);
prettyPrint(bst2.root);