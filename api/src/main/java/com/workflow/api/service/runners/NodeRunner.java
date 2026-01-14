package com.workflow.api.service.runners;

import com.workflow.api.dto.ExecutionSnapshot;
import com.workflow.api.dto.NodeRunResult;
import com.workflow.api.dto.WorkflowNode;

public interface NodeRunner {
    NodeRunResult run(WorkflowNode node, ExecutionSnapshot snapshot);
}
