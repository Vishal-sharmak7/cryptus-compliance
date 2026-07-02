import { z } from "zod";

// ── Evidence ─────────────────────────────────────────────────────
export const reviewEvidenceSchema = z.object({
  status:   z.enum(["APPROVED", "REJECTED"]),
  comments: z.string().min(1).max(1000),
});

// ── Audits ───────────────────────────────────────────────────────
export const createAuditSchema = z.object({
  title:        z.string().min(2).max(255),
  description:  z.string().max(2000).optional(),
  framework_id: z.number().int().positive().optional(),
  company_id:   z.number().int().positive(),
  auditor_id:   z.number().int().positive().optional(),
  status:       z.enum(["PLANNED", "IN_PROGRESS", "COMPLETED"]).default("PLANNED"),
  start_date:   z.string().optional(),
  end_date:     z.string().optional(),
});

export const updateAuditSchema = createAuditSchema.partial();

// ── Findings ─────────────────────────────────────────────────────
export const createFindingSchema = z.object({
  audit_id:    z.number().int().positive(),
  control_id:  z.number().int().positive().optional(),
  company_id:  z.number().int().positive(),
  title:       z.string().min(2).max(255),
  description: z.string().max(2000).optional(),
  severity:    z.enum(["CRITICAL", "HIGH", "MEDIUM", "LOW"]).default("MEDIUM"),
  status:      z.enum(["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"]).default("OPEN"),
  assigned_to: z.number().int().positive().optional(),
  due_date:    z.string().optional(),
});

export const updateFindingSchema = createFindingSchema.partial();

// ── Risks ────────────────────────────────────────────────────────
export const createRiskSchema = z.object({
  company_id:  z.number().int().positive(),
  title:       z.string().min(2).max(255),
  description: z.string().max(2000).optional(),
  impact:      z.enum(["CRITICAL", "HIGH", "MEDIUM", "LOW"]).default("MEDIUM"),
  likelihood:  z.enum(["CRITICAL", "HIGH", "MEDIUM", "LOW"]).default("MEDIUM"),
  severity:    z.enum(["CRITICAL", "HIGH", "MEDIUM", "LOW"]).default("MEDIUM"),
  status:      z.enum(["OPEN", "MITIGATED", "ACCEPTED", "CLOSED"]).default("OPEN"),
  owner:       z.string().max(255).optional(),
  mitigation:  z.string().max(2000).optional(),
  due_date:    z.string().optional(),
});

export const updateRiskSchema = createRiskSchema.partial();

// ── Tasks ────────────────────────────────────────────────────────
export const createTaskSchema = z.object({
  company_id:  z.number().int().positive(),
  control_id:  z.number().int().positive().optional(),
  assigned_to: z.number().int().positive().optional(),
  title:       z.string().min(2).max(255),
  description: z.string().max(2000).optional(),
  due_date:    z.string().optional(),
  priority:    z.enum(["HIGH", "MEDIUM", "LOW"]).default("MEDIUM"),
  status:      z.enum(["TODO", "IN_PROGRESS", "DONE"]).default("TODO"),
});

export const updateTaskSchema = createTaskSchema.partial();
