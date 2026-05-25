export type CheckStatus = 'UP' | 'DOWN' | 'DEGRADED' | 'FLAPPING' | 'UNKNOWN' | 'DENIED';

export interface OpsCheck {
  status: CheckStatus;
  detail?: string;
  [key: string]: string | number | boolean | undefined;
}

const siteVersion = import.meta.env.PUBLIC_SITE_VERSION?.trim() || 'dev';
const buildTime = new Date().toISOString();

export function getSiteVersion() {
  return siteVersion;
}

export function getBuildTime() {
  return buildTime;
}

export function getHealthPayload() {
  return {
    status: 'UP' as const,
    probe: 'HTTP GET /health',
    service: 'ayush-tiwari-cv',
    version: siteVersion,
    built_at: buildTime,
    message: "Liveness confirmed. Of course I have /health. I'm not a static brochure.",
    sre_mandate: 'compliant',
    checks: {
      heartbeat: {
        status: 'UP',
        detail: 'Still caffeinated. No restart required.',
      },
      career: {
        status: 'UP',
        tenure: '10+ years',
        detail: 'Platform engineering is a feature, not a bug.',
      },
      imposter_syndrome: {
        status: 'FLAPPING',
        detail: 'Recovered after a clean terraform plan.',
        remediation: 'kubectl explain confidence',
      },
      yaml: {
        status: 'UP',
        indentation: '2 spaces',
        tabs: 'rejected at admission controller',
      },
      pager: {
        status: 'UP',
        silenced: false,
        detail: 'Pager is armed. Mom has the escalation path.',
      },
      friday_deploys: {
        status: 'DENIED',
        policy: 'change-freeze-friday',
        detail: "This endpoint was deployed on a weekday. You're welcome.",
      },
      dns: {
        status: 'UP',
        detail: 'Not the root cause today. Check again tomorrow.',
      },
      coffee: {
        status: 'DEGRADED',
        level: 'refill recommended',
        detail: 'Non-blocking for HTTP 200 responses.',
      },
    },
    hints: {
      json: '/health.json',
      readiness: '/status',
      home: '/',
    },
  };
}

export function getStatusPayload() {
  return {
    status: 'READY' as const,
    probe: 'HTTP GET /status',
    service: 'ayush-tiwari-cv',
    version: siteVersion,
    built_at: buildTime,
    environment: 'production',
    region: 'github-pages-us-east-1',
    message: 'All dependencies nominal. Resume is downloadable. Dad jokes within SLO.',
    ownership: {
      team: 'platform-engineering-of-one',
      oncall: 'ayush@dbcelm.github.io',
      runbook: 'kubectl get events, then coffee',
    },
    dependencies: [
      {
        name: 'github-pages',
        status: 'HEALTHY',
        version: 'latest',
        note: 'Static assets. Boring in the best way.',
      },
      {
        name: 'github-actions',
        status: 'HEALTHY',
        note: 'Tags on push. Deploys after security. Civilization.',
      },
      {
        name: 'astro',
        status: 'HEALTHY',
        note: 'Builds this page so you can read this joke.',
      },
      {
        name: 'kubernetes.experience',
        status: 'HEALTHY',
        replicas: '700+ clusters operated',
        note: 'Emotionally available for multi-tenant questions.',
      },
      {
        name: 'terraform',
        status: 'HEALTHY',
        note: 'State is remote. Feelings are local.',
      },
      {
        name: 'coffee-supply-chain',
        status: 'DEGRADED',
        reason: 'afternoon slump',
        mitigation: 'espresso rollout in progress',
      },
      {
        name: 'friday-deploy-policy',
        status: 'DENIED',
        http_code: 451,
        note: "Come back Monday. Or don't. I'm not your manager.",
      },
    ],
    slos: [
      {
        name: 'site_availability',
        target: '99.9%',
        actual: '100% (it is static HTML)',
        error_budget: 'infinite until someone adds a database',
      },
      {
        name: 'recruiter_response_time',
        target: '48h',
        actual: 'calendar-dependent',
        error_budget: 'rechargeable via coffee',
      },
      {
        name: 'dad_jokes_per_deploy',
        target: '>= 1',
        actual: 'exceeded',
        error_budget: 'none remaining. Sorry.',
      },
      {
        name: 'mean_time_to_coffee',
        target: 'PT5M',
        actual: 'PT4M30S',
        error_budget: 'healthy',
      },
    ],
    capacity: {
      years_experience: '10+',
      nodes_managed: '1500+',
      clusters_operated: '700+',
      cloud_savings_usd: '250K+',
      patience: 'HIGH',
      tolerance_for_manual_deploys: 'LOW',
    },
    incidents: [
      {
        id: 'INC-404',
        title: 'Career path not found',
        status: 'resolved',
        resolution: 'Redeployed as DevOps. 200 OK ever since.',
      },
      {
        id: 'INC-503',
        title: 'Meeting overload',
        status: 'mitigated',
        resolution: 'Scaled calendar horizontally. Added async updates.',
      },
      {
        id: 'INC-418',
        title: 'I am a teapot',
        status: 'closed',
        resolution: 'RFC 2324 acknowledged. Brewed coffee instead.',
      },
    ],
    pods: [
      {
        name: 'cv-frontend-0',
        ready: '1/1',
        status: 'Running',
        restarts: 0,
        age: siteVersion,
      },
      {
        name: 'terraform-plan-7f3a',
        ready: '0/1',
        status: 'Completed',
        restarts: 12,
        age: '2y',
        note: 'Eventually converged.',
      },
      {
        name: 'oncall-brain-0',
        ready: '1/1',
        status: 'Running',
        restarts: 'too many',
        age: '10y',
      },
      {
        name: 'imposter-syndrome-6d9c',
        ready: '0/1',
        status: 'CrashLoopBackOff',
        restarts: 999,
        age: 'forever',
        note: 'HPA not configured. Self-doubt scales automatically.',
      },
      {
        name: 'coffee-maker-0',
        ready: '1/1',
        status: 'Running',
        restarts: 1,
        age: 'today',
      },
    ],
    events: [
      {
        type: 'Normal',
        reason: 'Pulled',
        object: 'image://ayush-tiwari:latest',
        message: 'Successfully pulled career highlights.',
      },
      {
        type: 'Warning',
        reason: 'FailedScheduling',
        object: 'meeting/standup-15m',
        message: 'Insufficient focus. Rescheduled to async.',
      },
      {
        type: 'Normal',
        reason: 'Scaled',
        object: 'deployment/platform-skills',
        message: 'HPA added Kubernetes, Terraform, and ArgoCD.',
      },
    ],
    live_metrics_note: 'Counters below are fictional. Your monitoring stack is safe.',
    hints: {
      json: '/status.json',
      liveness: '/health',
      home: '/',
    },
  };
}

export function getHealthJson() {
  return JSON.stringify(getHealthPayload(), null, 2);
}

export function getStatusJson() {
  return JSON.stringify(getStatusPayload(), null, 2);
}

/** Pun metrics that tick up on /status for smiles (not real telemetry). */
export const liveMetricSeeds = [
  { key: 'yaml_lines_reviewed', label: 'YAML lines reviewed (lifetime)', start: 847_291, step: [3, 17, 42] },
  { key: 'terraform_plans_on_friday', label: 'Terraform plans sent to prod on Friday', start: 0, step: [0, 0, 0] },
  { key: 'times_blamed_dns', label: 'Incidents blamed on DNS', start: 12, step: [0, 1, 0] },
  { key: 'kubectl_explain_runs', label: 'kubectl explain runs', start: 2_048, step: [1, 4, 9] },
  { key: 'coffee_cups_today', label: 'Coffee cups (today)', start: 2, step: [0, 1, 1] },
  { key: 'postmortems_with_snacks', label: 'Blameless postmortems with snacks', start: 37, step: [0, 0, 1] },
  { key: 'pipelines_green', label: 'Pipelines currently green', start: 11, step: [-1, 2, 0] },
  { key: 'unread_platform_slacks', label: 'Unread #platform messages', start: 3, step: [1, 5, 2] },
] as const;
