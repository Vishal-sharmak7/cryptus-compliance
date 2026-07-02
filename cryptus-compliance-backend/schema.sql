-- ================================================================
-- Cryptus Compliance Management Platform - Complete Schema
-- Compatible with MySQL 5.7+ and MySQL 8.x
-- Run: mysql -u root -p your_database < schema.sql
-- ================================================================

-- ── Phase 1: Add missing columns to evidences table ────────────────
-- Uses a stored procedure to safely add columns only if they don't exist.
DROP PROCEDURE IF EXISTS add_column_if_not_exists;

DELIMITER $$
CREATE PROCEDURE add_column_if_not_exists(
  IN tbl  VARCHAR(128),
  IN col  VARCHAR(128),
  IN def  TEXT
)
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = DATABASE()
      AND table_name   = tbl
      AND column_name  = col
  ) THEN
    SET @sql = CONCAT('ALTER TABLE `', tbl, '` ADD COLUMN `', col, '` ', def);
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
  END IF;
END $$
DELIMITER ;

-- Add new columns to evidences (safe: skips if already exist)
CALL add_column_if_not_exists('evidences', 'status',      "ENUM('PENDING','APPROVED','REJECTED') DEFAULT 'PENDING'");
CALL add_column_if_not_exists('evidences', 'reviewed_by', 'INT NULL');
CALL add_column_if_not_exists('evidences', 'reviewed_at', 'DATETIME NULL');
CALL add_column_if_not_exists('evidences', 'comments',    'TEXT NULL');
CALL add_column_if_not_exists('evidences', 'created_at',  'TIMESTAMP DEFAULT CURRENT_TIMESTAMP');
CALL add_column_if_not_exists('evidences', 'updated_at',  'TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP');

DROP PROCEDURE IF EXISTS add_column_if_not_exists;

-- ── Phase 2: Audits ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS audits (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  title        VARCHAR(255) NOT NULL,
  description  TEXT,
  framework_id INT,
  company_id   INT NOT NULL,
  auditor_id   INT,
  status       ENUM('PLANNED','IN_PROGRESS','COMPLETED') DEFAULT 'PLANNED',
  start_date   DATE,
  end_date     DATE,
  created_by   INT,
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_audits_company (company_id),
  INDEX idx_audits_auditor (auditor_id),
  INDEX idx_audits_status  (status)
);

CREATE TABLE IF NOT EXISTS audit_controls (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  audit_id   INT NOT NULL,
  control_id INT NOT NULL,
  status     ENUM('PENDING','REVIEWED','PASSED','FAILED') DEFAULT 'PENDING',
  notes      TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_audit_control (audit_id, control_id)
);

CREATE TABLE IF NOT EXISTS audit_evidence (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  audit_id    INT NOT NULL,
  evidence_id INT NOT NULL,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_audit_evidence (audit_id, evidence_id)
);

-- ── Phase 3: Findings ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS findings (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  audit_id    INT NOT NULL,
  control_id  INT,
  company_id  INT NOT NULL,
  title       VARCHAR(255) NOT NULL,
  description TEXT,
  severity    ENUM('CRITICAL','HIGH','MEDIUM','LOW') NOT NULL DEFAULT 'MEDIUM',
  status      ENUM('OPEN','IN_PROGRESS','RESOLVED','CLOSED') DEFAULT 'OPEN',
  assigned_to INT,
  due_date    DATE,
  resolved_at DATETIME,
  created_by  INT,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_findings_company  (company_id),
  INDEX idx_findings_audit    (audit_id),
  INDEX idx_findings_severity (severity),
  INDEX idx_findings_status   (status)
);

-- ── Phase 4: Risk Register ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS risks (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  company_id  INT NOT NULL,
  title       VARCHAR(255) NOT NULL,
  description TEXT,
  impact      ENUM('CRITICAL','HIGH','MEDIUM','LOW') DEFAULT 'MEDIUM',
  likelihood  ENUM('CRITICAL','HIGH','MEDIUM','LOW') DEFAULT 'MEDIUM',
  severity    ENUM('CRITICAL','HIGH','MEDIUM','LOW') DEFAULT 'MEDIUM',
  status      ENUM('OPEN','MITIGATED','ACCEPTED','CLOSED') DEFAULT 'OPEN',
  owner       VARCHAR(255),
  mitigation  TEXT,
  due_date    DATE,
  created_by  INT,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_risks_company  (company_id),
  INDEX idx_risks_severity (severity),
  INDEX idx_risks_status   (status)
);

-- ── Phase 5: Tasks ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS tasks (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  company_id  INT NOT NULL,
  control_id  INT,
  assigned_to INT,
  title       VARCHAR(255) NOT NULL,
  description TEXT,
  due_date    DATE,
  priority    ENUM('HIGH','MEDIUM','LOW') DEFAULT 'MEDIUM',
  status      ENUM('TODO','IN_PROGRESS','DONE') DEFAULT 'TODO',
  created_by  INT,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_tasks_company     (company_id),
  INDEX idx_tasks_assigned_to (assigned_to),
  INDEX idx_tasks_status      (status)
);

-- ── Phase 6: Notifications ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS notifications (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  user_id    INT NOT NULL,
  title      VARCHAR(255) NOT NULL,
  message    TEXT,
  type       ENUM('INFO','WARNING','SUCCESS','ERROR','SYSTEM') DEFAULT 'INFO',
  is_read    TINYINT(1) DEFAULT 0,
  link       VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_notif_user    (user_id),
  INDEX idx_notif_is_read (is_read)
);

-- ── Phase 10: Activity Logs ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS activity_logs (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  user_id     INT,
  company_id  INT,
  action      VARCHAR(100) NOT NULL,
  entity      VARCHAR(100),
  entity_id   INT,
  description TEXT,
  ip_address  VARCHAR(45),
  user_agent  TEXT,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_actlog_user    (user_id),
  INDEX idx_actlog_company (company_id),
  INDEX idx_actlog_action  (action)
);

-- ── Done ─────────────────────────────────────────────────────────
SELECT 'Schema applied successfully.' AS result;
