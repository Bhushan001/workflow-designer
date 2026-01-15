import { WorkflowNode, WorkflowEdge } from '../models/workflow.types';

interface TopologicalSortResult {
  sorted: WorkflowNode[];
  hasCycle: boolean;
}

/**
 * Performs topological sort on workflow nodes.
 * Returns sorted nodes and whether a cycle was detected.
 */
export function topologicalSort(
  nodes: WorkflowNode[],
  edges: WorkflowEdge[]
): TopologicalSortResult {
  const nodeMap = new Map<string, WorkflowNode>();
  const inDegree = new Map<string, number>();
  const adjacencyList = new Map<string, string[]>();

  // Initialize maps
  nodes.forEach((node) => {
    nodeMap.set(node.id, node);
    inDegree.set(node.id, 0);
    adjacencyList.set(node.id, []);
  });

  // Build adjacency list and calculate in-degrees
  edges.forEach((edge) => {
    const sourceList = adjacencyList.get(edge.source) || [];
    sourceList.push(edge.target);
    adjacencyList.set(edge.source, sourceList);

    const currentInDegree = inDegree.get(edge.target) || 0;
    inDegree.set(edge.target, currentInDegree + 1);
  });

  // Kahn's algorithm for topological sort
  const queue: string[] = [];
  const sorted: WorkflowNode[] = [];

  // Find all nodes with in-degree 0
  inDegree.forEach((degree, nodeId) => {
    if (degree === 0) {
      queue.push(nodeId);
    }
  });

  let processedCount = 0;

  while (queue.length > 0) {
    const nodeId = queue.shift()!;
    const node = nodeMap.get(nodeId);
    if (node) {
      sorted.push(node);
      processedCount++;
    }

    const neighbors = adjacencyList.get(nodeId) || [];
    neighbors.forEach((neighborId) => {
      const currentInDegree = inDegree.get(neighborId) || 0;
      inDegree.set(neighborId, currentInDegree - 1);

      if (inDegree.get(neighborId) === 0) {
        queue.push(neighborId);
      }
    });
  }

  // If processed count is less than total nodes, there's a cycle
  const hasCycle = processedCount < nodes.length;

  return { sorted, hasCycle };
}

