#!/usr/bin/env python3
"""Generate polished project sketch SVGs with crisp white labels."""
from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1] / "public" / "projects"

SKETCH_HEAD = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 280" fill="none">
  <defs>
    <filter id="sketch" x="-2%" y="-2%" width="104%" height="104%">
      <feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves="2" seed="{seed}" result="n"/>
      <feDisplacementMap in="SourceGraphic" in2="n" scale="0.9" xChannelSelector="R" yChannelSelector="G"/>
    </filter>
  </defs>
  <rect width="720" height="280" rx="16" fill="#0b0b10"/>
  <rect x="0.5" y="0.5" width="719" height="279" rx="15.5" stroke="rgba(255,255,255,0.06)"/>
  <g opacity="0.18" fill="#64748b">
    <circle cx="32" cy="28" r="0.8"/><circle cx="56" cy="28" r="0.8"/><circle cx="80" cy="28" r="0.8"/>
    <circle cx="640" cy="252" r="0.8"/><circle cx="664" cy="252" r="0.8"/><circle cx="688" cy="252" r="0.8"/>
  </g>
  <text x="28" y="36" fill="#475569" font-family="Georgia, serif" font-size="12" font-style="italic"> {title} </text>
  <g filter="url(#sketch)" stroke-linecap="round" stroke-linejoin="round">
{shapes}
  </g>
  <g font-family="ui-monospace, SFMono-Regular, Menlo, monospace" fill="#ffffff">
{labels}
  </g>
{caption}
</svg>
"""

LABEL = '    <text x="{x}" y="{y}" font-size="{size}" font-weight="500" opacity="{opacity}">{text}</text>'
CAPTION = '  <text x="{x}" y="{y}" fill="#64748b" font-family="Georgia, serif" font-size="11" font-style="italic" opacity="0.5">{text}</text>'


def write(path: str, seed: int, title: str, shapes: str, labels: list[dict], caption: dict | None = None) -> None:
    label_lines = "\n".join(
        LABEL.format(
            x=l["x"],
            y=l["y"],
            size=l.get("size", 10),
            opacity=l.get("opacity", 1),
            text=l["text"],
        )
        for l in labels
    )
    caption_block = (
        "\n" + CAPTION.format(x=caption["x"], y=caption["y"], text=caption["text"]) if caption else ""
    )
    content = SKETCH_HEAD.format(seed=seed, title=title, shapes=shapes.strip(), labels=label_lines, caption=caption_block)
    out = ROOT / path
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(content, encoding="utf-8")


ILLUSTRATIONS = [
    {
        "path": "bottlerocket-eks-migration/rollout.svg",
        "seed": 4,
        "title": "bottlerocket rollout",
        "shapes": """
    <rect x="96" y="78" width="92" height="68" rx="8" stroke="#64748b" stroke-width="1.6" fill="rgba(100,116,139,0.04)"/>
    <path d="M204 112 H248" stroke="#64748b" stroke-width="1.6" opacity="0.5"/>
    <polygon points="248,112 238,106 238,118" fill="#64748b" opacity="0.5"/>
    <rect x="268" y="72" width="96" height="80" rx="8" stroke="#f59e0b" stroke-width="1.8" fill="rgba(245,158,11,0.07)"/>
    <circle cx="316" cy="112" r="12" stroke="#f59e0b" stroke-width="1.5" fill="none" opacity="0.75"/>
    <path d="M380 112 H424" stroke="#f59e0b" stroke-width="1.8"/>
    <polygon points="424,112 414,106 414,118" fill="#f59e0b"/>
    <ellipse cx="492" cy="112" rx="38" ry="30" stroke="#22c55e" stroke-width="1.8" fill="rgba(34,197,94,0.06)"/>
    <path d="M120 196 Q280 184 440 192 Q560 200 640 188" stroke="#3b82f6" stroke-width="1.3" opacity="0.28" stroke-dasharray="5 7"/>
""",
        "labels": [
            {"x": 118, "y": 118, "text": "AL2", "size": 11},
            {"x": 292, "y": 118, "text": "Bottlerocket", "size": 10},
            {"x": 468, "y": 116, "text": "EKS nodes", "size": 10},
        ],
        "caption": {"x": 248, "y": 248, "text": "drain · validate · cutover"},
    },
    {
        "path": "karpenter-eks-autoscaling/flow.svg",
        "seed": 7,
        "title": "karpenter provisioning",
        "shapes": """
    <ellipse cx="108" cy="118" rx="44" ry="30" stroke="#64748b" stroke-width="1.6" fill="rgba(100,116,139,0.04)"/>
    <path d="M156 118 H200" stroke="#64748b" stroke-width="1.6" opacity="0.55"/>
    <polygon points="200,118 190,112 190,124" fill="#64748b" opacity="0.55"/>
    <rect x="220" y="92" width="84" height="52" rx="8" stroke="#3b82f6" stroke-width="1.8" fill="rgba(59,130,246,0.08)"/>
    <path d="M312 118 H356" stroke="#3b82f6" stroke-width="1.8"/>
    <polygon points="356,118 346,112 346,124" fill="#3b82f6"/>
    <rect x="376" y="86" width="88" height="64" rx="8" stroke="#8b5cf6" stroke-width="1.6" fill="rgba(139,92,246,0.06)"/>
    <path d="M472 118 H516" stroke="#8b5cf6" stroke-width="1.8"/>
    <polygon points="516,118 506,112 506,124" fill="#8b5cf6"/>
    <rect x="536" y="96" width="72" height="44" rx="6" stroke="#f59e0b" stroke-width="1.8" fill="rgba(245,158,11,0.06)"/>
    <path d="M140 188 Q360 172 580 184" stroke="#22c55e" stroke-width="1.3" opacity="0.25" stroke-dasharray="4 6"/>
    <path d="M608 148 Q628 188 588 208" stroke="#ec4899" stroke-width="1.4" opacity="0.35" fill="none"/>
""",
        "labels": [
            {"x": 82, "y": 122, "text": "Pending pod", "size": 9},
            {"x": 238, "y": 122, "text": "Karpenter", "size": 10},
            {"x": 396, "y": 122, "text": "NodeClaim", "size": 10},
            {"x": 558, "y": 122, "text": "EC2", "size": 10},
            {"x": 548, "y": 228, "text": "Spot · SQS", "size": 9, "opacity": 0.82},
        ],
        "caption": {"x": 236, "y": 248, "text": "seconds, not minutes"},
    },
    {
        "path": "multi-account-eks-observability/hub-spoke.svg",
        "seed": 11,
        "title": "observability hub",
        "shapes": """
    <circle cx="360" cy="128" r="46" stroke="#8b5cf6" stroke-width="1.8" fill="rgba(139,92,246,0.08)"/>
    <ellipse cx="128" cy="78" rx="54" ry="34" stroke="#64748b" stroke-width="1.6" fill="rgba(100,116,139,0.04)"/>
    <ellipse cx="592" cy="78" rx="54" ry="34" stroke="#64748b" stroke-width="1.6" fill="rgba(100,116,139,0.04)"/>
    <ellipse cx="148" cy="196" rx="50" ry="32" stroke="#64748b" stroke-width="1.6" fill="rgba(100,116,139,0.04)"/>
    <ellipse cx="572" cy="196" rx="50" ry="32" stroke="#64748b" stroke-width="1.6" fill="rgba(100,116,139,0.04)"/>
    <path d="M182 88 Q260 108 314 116" stroke="#64748b" stroke-width="1.5" opacity="0.55"/>
    <path d="M538 88 Q460 108 406 116" stroke="#64748b" stroke-width="1.5" opacity="0.55"/>
    <path d="M188 184 Q260 156 318 140" stroke="#64748b" stroke-width="1.5" opacity="0.55"/>
    <path d="M532 184 Q460 156 402 140" stroke="#64748b" stroke-width="1.5" opacity="0.55"/>
    <path d="M280 208 Q360 196 440 208" stroke="#3b82f6" stroke-width="1.2" opacity="0.25" stroke-dasharray="4 6"/>
""",
        "labels": [
            {"x": 334, "y": 124, "text": "Hub", "size": 11},
            {"x": 318, "y": 140, "text": "Monitor", "size": 9, "opacity": 0.82},
            {"x": 100, "y": 82, "text": "Account A", "size": 9},
            {"x": 564, "y": 82, "text": "Account B", "size": 9},
            {"x": 120, "y": 200, "text": "Account C", "size": 9},
            {"x": 544, "y": 200, "text": "Account D", "size": 9},
        ],
        "caption": {"x": 232, "y": 248, "text": "metrics · logs · traces in one pane"},
    },
    {
        "path": "argocd-at-scale/gitops-layers.svg",
        "seed": 3,
        "title": "gitops layers",
        "shapes": """
    <rect x="152" y="172" width="416" height="40" rx="8" stroke="#22c55e" stroke-width="1.8" fill="rgba(34,197,94,0.06)"/>
    <rect x="176" y="124" width="368" height="36" rx="8" stroke="#3b82f6" stroke-width="1.8" fill="rgba(59,130,246,0.06)"/>
    <rect x="208" y="78" width="304" height="32" rx="8" stroke="#64748b" stroke-width="1.5" fill="rgba(100,116,139,0.03)"/>
    <path d="M360 172 V164" stroke="#22c55e" stroke-width="1.4" opacity="0.5"/>
    <path d="M360 124 V112" stroke="#3b82f6" stroke-width="1.4" opacity="0.5"/>
    <circle cx="520" cy="192" r="16" stroke="#f59e0b" stroke-width="1.5" fill="none" opacity="0.7"/>
""",
        "labels": [
            {"x": 188, "y": 198, "text": "apps/ · manifests · helm", "size": 10},
            {"x": 204, "y": 148, "text": "appsets/ · ApplicationSet", "size": 10},
            {"x": 236, "y": 100, "text": "app-of-apps", "size": 10, "opacity": 0.88},
        ],
        "caption": {"x": 468, "y": 248, "text": "three levels · one mental model"},
    },
    {
        "path": "vpc-cni-to-cilium/dataplane.svg",
        "seed": 9,
        "title": "CNI migration",
        "shapes": """
    <rect x="88" y="92" width="196" height="88" rx="10" stroke="#64748b" stroke-width="1.8" fill="rgba(100,116,139,0.04)"/>
    <path d="M292 136 H336" stroke="#f59e0b" stroke-width="2"/>
    <polygon points="336,136 326,130 326,142" fill="#f59e0b"/>
    <rect x="356" y="92" width="196" height="88" rx="10" stroke="#22c55e" stroke-width="1.8" fill="rgba(34,197,94,0.06)"/>
    <circle cx="144" cy="118" r="7" stroke="#64748b" stroke-width="1.3" fill="none"/>
    <circle cx="188" cy="136" r="7" stroke="#64748b" stroke-width="1.3" fill="none"/>
    <circle cx="144" cy="154" r="7" stroke="#64748b" stroke-width="1.3" fill="none"/>
    <circle cx="412" cy="118" r="7" stroke="#22c55e" stroke-width="1.3" fill="none"/>
    <circle cx="456" cy="136" r="7" stroke="#22c55e" stroke-width="1.3" fill="none"/>
    <circle cx="412" cy="154" r="7" stroke="#22c55e" stroke-width="1.3" fill="none"/>
    <path d="M152 124 Q168 132 188 136 M144 146 Q156 154 168 154" stroke="#64748b" stroke-width="1.1" opacity="0.35"/>
    <path d="M420 124 Q436 132 456 136 M412 146 Q424 154 436 154" stroke="#22c55e" stroke-width="1.1" opacity="0.35"/>
""",
        "labels": [
            {"x": 148, "y": 142, "text": "vpc-cni", "size": 11},
            {"x": 300, "y": 124, "text": "migrate", "size": 9, "opacity": 0.85},
            {"x": 416, "y": 142, "text": "Cilium", "size": 11},
        ],
        "caption": {"x": 228, "y": 248, "text": "eBPF datapath · fewer hops"},
    },
    {
        "path": "eks-cost-optimization/waste-model.svg",
        "seed": 15,
        "title": "right-size the fleet",
        "shapes": """
    <rect x="108" y="84" width="72" height="112" rx="6" stroke="#ef4444" stroke-width="1.6" fill="rgba(239,68,68,0.05)"/>
    <rect x="212" y="100" width="60" height="96" rx="6" stroke="#f59e0b" stroke-width="1.6" fill="rgba(245,158,11,0.05)"/>
    <rect x="308" y="112" width="52" height="84" rx="6" stroke="#3b82f6" stroke-width="1.6" fill="rgba(59,130,246,0.05)"/>
    <rect x="404" y="122" width="44" height="74" rx="6" stroke="#22c55e" stroke-width="1.6" fill="rgba(34,197,94,0.05)"/>
    <rect x="492" y="130" width="36" height="66" rx="6" stroke="#22c55e" stroke-width="1.8" fill="rgba(34,197,94,0.07)"/>
    <path d="M148 212 Q320 198 492 206 Q580 214 632 204" stroke="#64748b" stroke-width="1.2" opacity="0.25" stroke-dasharray="4 6"/>
    <path d="M612 88 Q628 104 612 120" stroke="#22c55e" stroke-width="1.5" opacity="0.55"/>
""",
        "labels": [
            {"x": 132, "y": 148, "text": "XL", "size": 10},
            {"x": 232, "y": 152, "text": "L", "size": 10},
            {"x": 328, "y": 158, "text": "M", "size": 10},
            {"x": 418, "y": 162, "text": "S", "size": 10},
            {"x": 502, "y": 166, "text": "XS", "size": 10},
            {"x": 618, "y": 108, "text": "$", "size": 12, "opacity": 0.85},
        ],
        "caption": {"x": 188, "y": 248, "text": "greedy · pets · isolated workloads"},
    },
    {
        "path": "gpu-dynamic-partitioning/partitioning.svg",
        "seed": 22,
        "title": "GPU partitioning",
        "shapes": """
    <rect x="292" y="76" width="136" height="96" rx="8" stroke="#8b5cf6" stroke-width="1.8" fill="rgba(139,92,246,0.07)"/>
    <line x1="308" y1="120" x2="412" y2="120" stroke="#8b5cf6" stroke-width="1.2" opacity="0.45"/>
    <line x1="308" y1="140" x2="412" y2="140" stroke="#8b5cf6" stroke-width="1.2" opacity="0.45"/>
    <rect x="308" y="88" width="48" height="28" rx="4" stroke="#22c55e" stroke-width="1.4" fill="rgba(34,197,94,0.08)"/>
    <rect x="364" y="88" width="48" height="28" rx="4" stroke="#22c55e" stroke-width="1.4" fill="rgba(34,197,94,0.08)"/>
    <rect x="308" y="148" width="48" height="28" rx="4" stroke="#3b82f6" stroke-width="1.4" fill="rgba(59,130,246,0.08)"/>
    <rect x="364" y="148" width="48" height="28" rx="4" stroke="#3b82f6" stroke-width="1.4" fill="rgba(59,130,246,0.08)"/>
    <ellipse cx="128" cy="128" rx="36" ry="26" stroke="#f59e0b" stroke-width="1.6" fill="rgba(245,158,11,0.05)"/>
    <path d="M168 128 H252" stroke="#f59e0b" stroke-width="1.5" opacity="0.55"/>
    <path d="M436 128 H520" stroke="#f59e0b" stroke-width="1.5" opacity="0.55"/>
    <ellipse cx="592" cy="128" rx="36" ry="26" stroke="#f59e0b" stroke-width="1.6" fill="rgba(245,158,11,0.05)"/>
""",
        "labels": [
            {"x": 312, "y": 106, "text": "A100 / H100", "size": 10},
            {"x": 316, "y": 128, "text": "MIG-1", "size": 9},
            {"x": 372, "y": 128, "text": "MIG-2", "size": 9},
            {"x": 100, "y": 132, "text": "Job A", "size": 9},
            {"x": 564, "y": 132, "text": "Job B", "size": 9},
        ],
        "caption": {"x": 228, "y": 248, "text": "MIG · time-slice · DCGM metrics"},
    },
    {
        "path": "keda-at-scale/scaling-matrix.svg",
        "seed": 18,
        "title": "event-driven scale",
        "shapes": """
    <rect x="88" y="104" width="68" height="48" rx="8" stroke="#64748b" stroke-width="1.6" fill="rgba(100,116,139,0.04)"/>
    <path d="M164 128 H208" stroke="#64748b" stroke-width="1.6" opacity="0.55"/>
    <polygon points="208,128 198,122 198,134" fill="#64748b" opacity="0.55"/>
    <rect x="228" y="96" width="76" height="64" rx="8" stroke="#f59e0b" stroke-width="1.8" fill="rgba(245,158,11,0.07)"/>
    <path d="M312 128 H356" stroke="#f59e0b" stroke-width="1.8"/>
    <polygon points="356,128 346,122 346,134" fill="#f59e0b"/>
    <rect x="376" y="88" width="88" height="80" rx="8" stroke="#3b82f6" stroke-width="1.8" fill="rgba(59,130,246,0.06)"/>
    <path d="M472 128 H516" stroke="#3b82f6" stroke-width="1.8"/>
    <polygon points="516,128 506,122 506,134" fill="#3b82f6"/>
    <ellipse cx="584" cy="128" rx="40" ry="30" stroke="#22c55e" stroke-width="1.8" fill="rgba(34,197,94,0.06)"/>
    <path d="M120 196 Q360 184 600 192" stroke="#64748b" stroke-width="1.2" opacity="0.22" stroke-dasharray="4 6"/>
""",
        "labels": [
            {"x": 108, "y": 132, "text": "Queue", "size": 10},
            {"x": 252, "y": 132, "text": "KEDA", "size": 10},
            {"x": 402, "y": 120, "text": "HPA", "size": 10},
            {"x": 402, "y": 148, "text": "VPA", "size": 9, "opacity": 0.88},
            {"x": 564, "y": 132, "text": "Pods", "size": 10},
        ],
        "caption": {"x": 204, "y": 248, "text": "lag drops · scale out · idle · scale in"},
    },
    {
        "path": "multi-tenant-eks/isolation.svg",
        "seed": 6,
        "title": "multi-tenant isolation",
        "shapes": """
    <rect x="128" y="76" width="464" height="132" rx="12" stroke="#64748b" stroke-width="1.6" fill="rgba(100,116,139,0.03)"/>
    <rect x="156" y="112" width="120" height="76" rx="8" stroke="#3b82f6" stroke-width="1.6" fill="rgba(59,130,246,0.06)"/>
    <rect x="300" y="112" width="120" height="76" rx="8" stroke="#22c55e" stroke-width="1.6" fill="rgba(34,197,94,0.06)"/>
    <rect x="444" y="112" width="120" height="76" rx="8" stroke="#f59e0b" stroke-width="1.6" fill="rgba(245,158,11,0.06)"/>
    <path d="M216 112 V96 M360 112 V96 M504 112 V96" stroke="#64748b" stroke-width="1.3" opacity="0.4"/>
    <circle cx="216" cy="88" r="10" stroke="#64748b" stroke-width="1.3" fill="none"/>
    <circle cx="360" cy="88" r="10" stroke="#64748b" stroke-width="1.3" fill="none"/>
    <circle cx="504" cy="88" r="10" stroke="#64748b" stroke-width="1.3" fill="none"/>
""",
        "labels": [
            {"x": 148, "y": 98, "text": "EKS cluster", "size": 10, "opacity": 0.88},
            {"x": 180, "y": 156, "text": "tenant-a", "size": 10},
            {"x": 324, "y": 156, "text": "tenant-b", "size": 10},
            {"x": 468, "y": 156, "text": "tenant-c", "size": 10},
            {"x": 204, "y": 92, "text": "RBAC", "size": 8, "opacity": 0.82},
        ],
        "caption": {"x": 188, "y": 248, "text": "namespace · quota · onboarding runbook"},
    },
    {
        "path": "eks-saas-throttling/gateway-tiering.svg",
        "seed": 13,
        "title": "per-tenant throttling",
        "shapes": """
    <ellipse cx="124" cy="128" rx="48" ry="32" stroke="#64748b" stroke-width="1.6" fill="rgba(100,116,139,0.04)"/>
    <path d="M176 128 H220" stroke="#64748b" stroke-width="1.6" opacity="0.55"/>
    <polygon points="220,128 210,122 210,134" fill="#64748b" opacity="0.55"/>
    <rect x="240" y="92" width="156" height="72" rx="10" stroke="#3b82f6" stroke-width="1.8" fill="rgba(59,130,246,0.07)"/>
    <path d="M404 128 H448" stroke="#3b82f6" stroke-width="1.8"/>
    <polygon points="448,128 438,122 438,134" fill="#3b82f6"/>
    <rect x="468" y="104" width="96" height="48" rx="8" stroke="#22c55e" stroke-width="1.8" fill="rgba(34,197,94,0.06)"/>
    <path d="M318 168 Q338 196 358 168 Q378 140 398 168" stroke="#ef4444" stroke-width="1.4" opacity="0.45" fill="none"/>
""",
        "labels": [
            {"x": 96, "y": 132, "text": "Client", "size": 10},
            {"x": 276, "y": 118, "text": "API Gateway", "size": 10},
            {"x": 276, "y": 144, "text": "usage plan · key", "size": 8, "opacity": 0.88},
            {"x": 488, "y": 132, "text": "EKS svc", "size": 10},
            {"x": 292, "y": 204, "text": "429 rate limit", "size": 9, "opacity": 0.85},
        ],
        "caption": {"x": 188, "y": 248, "text": "fair share · burst caps · tenant keys"},
    },
    {
        "path": "terraform-to-crossplane/migration.svg",
        "seed": 20,
        "title": "terraform to crossplane",
        "shapes": """
    <rect x="88" y="104" width="124" height="72" rx="10" stroke="#64748b" stroke-width="1.6" fill="rgba(100,116,139,0.04)"/>
    <path d="M220 140 H264" stroke="#f59e0b" stroke-width="2"/>
    <polygon points="264,140 254,134 254,146" fill="#f59e0b"/>
    <rect x="284" y="92" width="144" height="96" rx="10" stroke="#22c55e" stroke-width="1.8" fill="rgba(34,197,94,0.07)"/>
    <path d="M436 140 H480" stroke="#22c55e" stroke-width="1.8"/>
    <polygon points="480,140 470,134 470,146" fill="#22c55e"/>
    <ellipse cx="556" cy="140" rx="44" ry="32" stroke="#3b82f6" stroke-width="1.8" fill="rgba(59,130,246,0.06)"/>
""",
        "labels": [
            {"x": 112, "y": 132, "text": "Terraform", "size": 10},
            {"x": 108, "y": 156, "text": "state · plan", "size": 8, "opacity": 0.88},
            {"x": 308, "y": 124, "text": "Crossplane", "size": 10},
            {"x": 304, "y": 148, "text": "XRD · composition", "size": 8, "opacity": 0.88},
            {"x": 232, "y": 124, "text": "migrate", "size": 9, "opacity": 0.85},
            {"x": 532, "y": 144, "text": "K8s", "size": 10},
        ],
        "caption": {"x": 188, "y": 248, "text": "CRDs in-cluster · GitOps native"},
    },
    {
        "path": "cicd-pipeline-security/pipeline.svg",
        "seed": 25,
        "title": "shift-left security",
        "shapes": """
    <path d="M96 196 Q196 156 296 136 Q396 116 496 126 Q596 136 636 156" stroke="#64748b" stroke-width="1.5" opacity="0.3"/>
    <circle cx="120" cy="188" r="18" stroke="#3b82f6" stroke-width="1.6" fill="rgba(59,130,246,0.07)"/>
    <circle cx="240" cy="148" r="18" stroke="#f59e0b" stroke-width="1.6" fill="rgba(245,158,11,0.07)"/>
    <circle cx="360" cy="124" r="18" stroke="#8b5cf6" stroke-width="1.6" fill="rgba(139,92,246,0.07)"/>
    <circle cx="480" cy="124" r="18" stroke="#22c55e" stroke-width="1.6" fill="rgba(34,197,94,0.07)"/>
    <circle cx="600" cy="144" r="18" stroke="#ef4444" stroke-width="1.6" fill="rgba(239,68,68,0.07)"/>
    <rect x="528" y="176" width="76" height="44" rx="8" stroke="#ec4899" stroke-width="1.5" fill="rgba(236,72,153,0.05)"/>
""",
        "labels": [
            {"x": 108, "y": 192, "text": "Git", "size": 9},
            {"x": 224, "y": 152, "text": "SAST", "size": 9},
            {"x": 346, "y": 128, "text": "Scan", "size": 9},
            {"x": 466, "y": 128, "text": "Build", "size": 9},
            {"x": 586, "y": 148, "text": "DAST", "size": 9},
            {"x": 548, "y": 204, "text": "Falco", "size": 9},
        ],
        "caption": {"x": 168, "y": 248, "text": "SonarQube · Wiz · runtime guardrails"},
    },
]


def main() -> None:
    for item in ILLUSTRATIONS:
        write(
            item["path"],
            item["seed"],
            item["title"],
            item["shapes"],
            item["labels"],
            item.get("caption"),
        )
    print(f"Wrote {len(ILLUSTRATIONS)} polished sketches")


if __name__ == "__main__":
    main()
