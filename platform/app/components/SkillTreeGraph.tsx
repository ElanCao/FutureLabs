"use client";

import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
  MarkerType,
  Panel,
  BackgroundVariant,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useCallback, useMemo, useEffect } from "react";
import dagre from "dagre";
import { trackEvent } from "@/lib/analytics";
import { BRANCH_COLORS } from "@/lib/branch-colors";
export { BRANCH_COLORS } from "@/lib/branch-colors";

// ── Types ───────────────────────────────────────────────────────────────────

export interface SkillNodeData extends Record<string, unknown> {
  label: string;
  icon: string;
  branch: string;
  branchColor: string;
  level: number;
  maxLevel: number;
  xp: number;
  verified: boolean;
  locked: boolean;
}

export interface SkillEdgeData {
  prerequisite?: boolean;
}

// ── Branch color map re-exported for consumers ───────────────────────────────

const BRANCH_BG: Record<string, string> = {
  engineering: "#1e1b4b",
  ai_ml: "#2e1065",
  cloud_infra: "#082f49",
  data: "#431407",
  product: "#083344",
  design: "#451a03",
  soft_skills: "#052e16",
};

// ── Layout ──────────────────────────────────────────────────────────────────

function layoutGraph(nodes: Node[], edges: Edge[]): Node[] {
  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: "TB", ranksep: 80, nodesep: 40, marginx: 40, marginy: 40 });

  nodes.forEach((n) => g.setNode(n.id, { width: 180, height: 80 }));
  edges.forEach((e) => g.setEdge(e.source, e.target));

  dagre.layout(g);

  return nodes.map((n) => {
    const pos = g.node(n.id);
    return { ...n, position: { x: pos.x - 90, y: pos.y - 40 } };
  });
}

// ── Custom Node ──────────────────────────────────────────────────────────────

function SkillNode({ data }: { data: SkillNodeData }) {
  const color = data.branchColor;
  const bg = BRANCH_BG[data.branch] ?? "#1a1a2e";
  const filled = data.level > 0;
  const pct = data.maxLevel > 0 ? (data.level / data.maxLevel) * 100 : 0;

  return (
    <div
      style={{
        border: `1.5px solid ${filled ? color : "#374151"}`,
        borderRadius: 12,
        background: filled ? bg : "#111118",
        width: 180,
        padding: "10px 12px",
        opacity: data.locked ? 0.45 : 1,
        boxShadow: filled ? `0 0 12px ${color}33` : "none",
        cursor: "pointer",
        transition: "all 0.2s",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
        <span style={{ fontSize: 20 }}>{data.icon}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ color: "#f3f4f6", fontSize: 12, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {data.label}
          </div>
          <div style={{ color: filled ? color : "#6b7280", fontSize: 10, marginTop: 1 }}>
            {filled ? `Lv ${data.level} / ${data.maxLevel}` : "Locked"}
          </div>
        </div>
        {data.verified && (
          <span title="Verified" style={{ fontSize: 12 }}>✅</span>
        )}
      </div>
      {/* XP progress bar */}
      <div style={{ height: 3, background: "#1f2937", borderRadius: 2, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 2, transition: "width 0.3s" }} />
      </div>
    </div>
  );
}

const nodeTypes = { skill: SkillNode };

// ── Props ────────────────────────────────────────────────────────────────────

export interface SkillInput {
  id: string;
  name: string;
  icon: string;
  branch: string;
  maxLevel: number;
  parentSkillId?: string | null;
  prerequisites?: string[];
}

export interface UserSkillInput {
  skillId: string;
  currentLevel: number;
  xp: number;
  verified?: boolean;
}

interface Props {
  skills: SkillInput[];
  userSkills?: UserSkillInput[];
  activeBranch?: string;
  readOnly?: boolean;
}

// ── Main component ────────────────────────────────────────────────────────────

export default function SkillTreeGraph({ skills, userSkills = [], activeBranch }: Props) {
  const userMap = useMemo(() => {
    const m: Record<string, UserSkillInput> = {};
    for (const us of userSkills) m[us.skillId] = us;
    return m;
  }, [userSkills]);

  const filteredSkills = useMemo(
    () => (activeBranch ? skills.filter((s) => s.branch === activeBranch) : skills),
    [skills, activeBranch]
  );

  const rawNodes: Node[] = useMemo(
    () =>
      filteredSkills.map((s) => {
        const us = userMap[s.id];
        const color = BRANCH_COLORS[s.branch] ?? "#6b7280";
        return {
          id: s.id,
          type: "skill",
          position: { x: 0, y: 0 },
          data: {
            label: s.name,
            icon: s.icon ?? "⭐",
            branch: s.branch,
            branchColor: color,
            level: us?.currentLevel ?? 0,
            maxLevel: s.maxLevel,
            xp: us?.xp ?? 0,
            verified: us?.verified ?? false,
            locked: !us || us.currentLevel === 0,
          } as SkillNodeData,
        };
      }),
    [filteredSkills, userMap]
  );

  const filteredIds = useMemo(() => new Set(filteredSkills.map((s) => s.id)), [filteredSkills]);

  const rawEdges: Edge[] = useMemo(() => {
    const edges: Edge[] = [];
    for (const s of filteredSkills) {
      if (s.parentSkillId && filteredIds.has(s.parentSkillId)) {
        edges.push({
          id: `${s.parentSkillId}->${s.id}`,
          source: s.parentSkillId,
          target: s.id,
          type: "smoothstep",
          markerEnd: { type: MarkerType.ArrowClosed, color: "#4b5563" },
          style: { stroke: "#4b5563", strokeWidth: 1.5 },
        });
      }
      for (const prereq of s.prerequisites ?? []) {
        if (filteredIds.has(prereq) && prereq !== s.parentSkillId) {
          edges.push({
            id: `${prereq}-->${s.id}`,
            source: prereq,
            target: s.id,
            type: "smoothstep",
            animated: true,
            markerEnd: { type: MarkerType.ArrowClosed, color: "#7c3aed" },
            style: { stroke: "#7c3aed", strokeWidth: 1, strokeDasharray: "4 2" },
          });
        }
      }
    }
    return edges;
  }, [filteredSkills, filteredIds]);

  const laidOutNodes = useMemo(() => layoutGraph(rawNodes, rawEdges), [rawNodes, rawEdges]);

  const [nodes, setNodes, onNodesChange] = useNodesState(laidOutNodes);
  const [edges, , onEdgesChange] = useEdgesState(rawEdges);

  useEffect(() => {
    setNodes(layoutGraph(rawNodes, rawEdges));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rawNodes, rawEdges]);

  const nodeColor = useCallback((n: Node) => {
    const data = n.data as unknown as SkillNodeData;
    return (data.locked as boolean) ? "#374151" : (data.branchColor as string);
  }, []);

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    trackEvent("skill_explore", { skill_id: node.id });
  }, []);

  return (
    <div style={{ width: "100%", height: "100%", background: "#0a0a0f", borderRadius: 12, overflow: "hidden" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.15 }}
        minZoom={0.15}
        maxZoom={2}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#1f2937" gap={24} size={1} variant={BackgroundVariant.Dots} />
        <Controls
          style={{ background: "#111118", border: "1px solid #374151", borderRadius: 8 }}
          showInteractive={false}
        />
        <MiniMap
          nodeColor={nodeColor}
          style={{ background: "#111118", border: "1px solid #374151", borderRadius: 8 }}
          maskColor="rgba(0,0,0,0.6)"
        />
        <Panel position="bottom-right" style={{ fontSize: 11, color: "#6b7280", padding: "4px 8px", background: "#111118", border: "1px solid #1f2937", borderRadius: 6 }}>
          Scroll to zoom · Drag to pan
        </Panel>
      </ReactFlow>
    </div>
  );
}
