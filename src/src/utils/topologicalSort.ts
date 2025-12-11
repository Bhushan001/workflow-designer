import { WorkflowNode, WorkflowEdge } from '../types/workflow.types';

export function topologicalSort(
  nodes: WorkflowNode[],
  edges: WorkflowEdge[]
): { sorted: WorkflowNode[]; hasCycle: boolean } {
  const nodeMap = new Map<string, WorkflowNode>();
  const inDegree = new Map<string, number>();
  const adjacency = new Map<string, string[]>();

  // Initialize
  nodes.forEach(node => {
    nodeMap.set(node.id, node);
    inDegree.set(node.id, 0);
    adjacency.set(node.id, []);
  });

  // Build graph
  edges.forEach(edge => {
    const source = edge.source;
    const target = edge.target;
    
    if (adjacency.has(source) && inDegree.has(target)) {
      adjacency.get(source)!.push(target);
      inDegree.set(target, (inDegree.get(target) || 0) + 1);
    }
  });

  // Kahn's algorithm
  const queue: string[] = [];
  const sorted: WorkflowNode[] = [];

  // Find all nodes with no incoming edges
  inDegree.forEach((degree, nodeId) => {
    if (degree === 0) {
      queue.push(nodeId);
    }
  });

  while (queue.length > 0) {
    const nodeId = queue.shift()!;
    const node = nodeMap.get(nodeId);
    if (node) {
      sorted.push(node);
    }

    const neighbors = adjacency.get(nodeId) || [];
    neighbors.forEach(neighbor => {
      const newDegree = (inDegree.get(neighbor) || 0) - 1;
      inDegree.set(neighbor, newDegree);
      if (newDegree === 0) {
        queue.push(neighbor);
      }
    });
  }

  const hasCycle = sorted.length !== nodes.length;

  return { sorted, hasCycle };
}
