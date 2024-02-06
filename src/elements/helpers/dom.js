
export function findTextNodes(node) {
    var A = [];
    if (node) {
      node = node.firstChild;
      while (node != null) {
        if (node.nodeType == 3) A[A.length] = node;
        else A = A.concat(findTextNodes(node));
        node = node.nextSibling;
      }
    }
    return A;
  }
  