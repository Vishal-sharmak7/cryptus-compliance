const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "Cryptus Compliance Management Platform API",
    version: "2.0.0",
    description: "API documentation for the Cryptus Compliance Management Platform backend. Supports user management, authentication, company-framework configuration, control checklists, evidence uploads with verification workflows, audits, findings, risks register, tasks, and analytics dashboards.",
    contact: {
      name: "Cryptus Compliance Support",
      email: "support@cryptus.in"
    }
  },
  servers: [
    {
      url: "http://localhost:5000",
      description: "Local development server"
    }
  ],
  security: [
    {
      bearerAuth: []
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "Enter your JWT token in the format: Bearer <token>"
      }
    },
    schemas: {
      User: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          name: { type: "string", example: "John Doe" },
          email: { type: "string", format: "email", example: "john@example.com" },
          role: { type: "string", enum: ["SUPER_ADMIN", "AUDITOR", "CLIENT"], example: "CLIENT" },
          company_id: { type: "integer", nullable: true, example: 5 },
          created_at: { type: "string", format: "date-time", example: "2026-07-06T12:00:00.000Z" }
        }
      },
      Company: {
        type: "object",
        required: ["name"],
        properties: {
          id: { type: "integer", example: 1 },
          name: { type: "string", example: "Acme Corp" },
          industry: { type: "string", example: "FinTech" },
          website: { type: "string", example: "https://acme.com" }
        }
      },
      Framework: {
        type: "object",
        required: ["name"],
        properties: {
          id: { type: "integer", example: 1 },
          name: { type: "string", example: "SOC2" },
          description: { type: "string", example: "System and Organization Controls 2 security framework" },
          status: { type: "string", example: "ACTIVE" }
        }
      },
      Control: {
        type: "object",
        required: ["framework_id", "title"],
        properties: {
          id: { type: "integer", example: 1 },
          framework_id: { type: "integer", example: 2 },
          title: { type: "string", example: "Access Control Policy" },
          description: { type: "string", example: "Policy defining access level controls." },
          category: { type: "string", nullable: true, example: "Security" }
        }
      },
      CompanyFramework: {
        type: "object",
        required: ["company_id", "framework_id"],
        properties: {
          id: { type: "integer", example: 1 },
          company_id: { type: "integer", example: 3 },
          framework_id: { type: "integer", example: 2 },
          progress_percentage: { type: "number", example: 45.5 },
          assigned_at: { type: "string", format: "date-time" }
        }
      },
      CompanyControl: {
        type: "object",
        required: ["company_id", "control_id"],
        properties: {
          id: { type: "integer", example: 1 },
          company_id: { type: "integer", example: 3 },
          control_id: { type: "integer", example: 4 },
          status: { type: "string", enum: ["PENDING", "IMPLEMENTED", "EXEMPT"], example: "PENDING" },
          assigned_at: { type: "string", format: "date-time" }
        }
      },
      Evidence: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          company_control_id: { type: "integer", nullable: true, example: 10 },
          company_id: { type: "integer", example: 3 },
          title: { type: "string", example: "Firewall Configuration PDF" },
          description: { type: "string", example: "Details on current network configurations." },
          file_name: { type: "string", example: "1688195821034-firewall.pdf" },
          file_path: { type: "string", example: "uploads/1688195821034-firewall.pdf" },
          uploaded_by: { type: "integer", example: 5 },
          status: { type: "string", enum: ["PENDING", "APPROVED", "REJECTED"], example: "PENDING" },
          comments: { type: "string", nullable: true, example: "Approved by Auditor" },
          reviewed_by: { type: "integer", nullable: true },
          reviewed_at: { type: "string", format: "date-time", nullable: true },
          created_at: { type: "string", format: "date-time" }
        }
      },
      Audit: {
        type: "object",
        required: ["title", "company_id"],
        properties: {
          id: { type: "integer", example: 1 },
          title: { type: "string", example: "Q3 Internal Audit" },
          description: { type: "string", example: "Quarterly review of compliance frameworks" },
          framework_id: { type: "integer", example: 2 },
          company_id: { type: "integer", example: 3 },
          auditor_id: { type: "integer", example: 2 },
          status: { type: "string", enum: ["PLANNED", "IN_PROGRESS", "COMPLETED"], example: "IN_PROGRESS" },
          start_date: { type: "string", format: "date", example: "2026-07-01" },
          end_date: { type: "string", format: "date", example: "2026-07-15" }
        }
      },
      Finding: {
        type: "object",
        required: ["audit_id", "company_id", "title"],
        properties: {
          id: { type: "integer", example: 1 },
          audit_id: { type: "integer", example: 2 },
          control_id: { type: "integer", nullable: true, example: 5 },
          company_id: { type: "integer", example: 3 },
          title: { type: "string", example: "Password policy not enforced" },
          description: { type: "string", example: "Weak character requirements for user accounts." },
          severity: { type: "string", enum: ["CRITICAL", "HIGH", "MEDIUM", "LOW"], example: "HIGH" },
          status: { type: "string", enum: ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"], example: "OPEN" },
          assigned_to: { type: "integer", nullable: true },
          due_date: { type: "string", format: "date" },
          resolved_at: { type: "string", format: "date-time", nullable: true }
        }
      },
      Risk: {
        type: "object",
        required: ["company_id", "title"],
        properties: {
          id: { type: "integer", example: 1 },
          company_id: { type: "integer", example: 3 },
          title: { type: "string", example: "Database Data Leak" },
          description: { type: "string", example: "Risk of unencrypted backups leakage" },
          impact: { type: "string", enum: ["CRITICAL", "HIGH", "MEDIUM", "LOW"], example: "HIGH" },
          likelihood: { type: "string", enum: ["CRITICAL", "HIGH", "MEDIUM", "LOW"], example: "MEDIUM" },
          severity: { type: "string", enum: ["CRITICAL", "HIGH", "MEDIUM", "LOW"], example: "HIGH" },
          status: { type: "string", enum: ["OPEN", "MITIGATED", "ACCEPTED", "CLOSED"], example: "OPEN" },
          owner: { type: "string", example: "CISO" },
          mitigation: { type: "string", example: "Encrypt databases and manage keys properly." },
          due_date: { type: "string", format: "date" }
        }
      },
      Task: {
        type: "object",
        required: ["company_id", "title"],
        properties: {
          id: { type: "integer", example: 1 },
          company_id: { type: "integer", example: 3 },
          control_id: { type: "integer", nullable: true },
          assigned_to: { type: "integer", nullable: true },
          title: { type: "string", example: "Implement Multi-Factor Authentication" },
          description: { type: "string", example: "Enable MFA for all admin portals" },
          due_date: { type: "string", format: "date" },
          priority: { type: "string", enum: ["HIGH", "MEDIUM", "LOW"], example: "HIGH" },
          status: { type: "string", enum: ["TODO", "IN_PROGRESS", "DONE"], example: "TODO" }
        }
      },
      Notification: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          user_id: { type: "integer", example: 5 },
          title: { type: "string", example: "Evidence Approved" },
          message: { type: "string", example: "Your SOC2 Evidence ID: 10 has been approved." },
          type: { type: "string", enum: ["INFO", "WARNING", "SUCCESS", "ERROR", "SYSTEM"], example: "SUCCESS" },
          is_read: { type: "boolean", example: false },
          link: { type: "string", nullable: true, example: "/evidence/10" },
          created_at: { type: "string", format: "date-time" }
        }
      }
    }
  },
  paths: {
    "/api/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Register a new user",
        security: [],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "email", "password"],
                properties: {
                  name: { type: "string", example: "John Doe" },
                  email: { type: "string", format: "email", example: "john@example.com" },
                  password: { type: "string", format: "password", example: "Password123" }
                }
              }
            }
          }
        },
        responses: {
          201: {
            description: "User registered successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "User registered" }
                  }
                }
              }
            }
          },
          400: {
            description: "User already exists or missing parameters"
          }
        }
      }
    },
    "/api/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Login and generate session token",
        security: [],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: { type: "string", format: "email", example: "john@example.com" },
                  password: { type: "string", format: "password", example: "Password123" }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: "Logged in successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    token: { type: "string", example: "eyJhbGciOiJIUzI1NiIsIn..." },
                    user: {
                      type: "object",
                      properties: {
                        id: { type: "integer", example: 1 },
                        name: { type: "string", example: "John Doe" },
                        email: { type: "string", example: "john@example.com" },
                        role: { type: "string", example: "CLIENT" }
                      }
                    }
                  }
                }
              }
            }
          },
          401: {
            description: "Invalid credentials"
          },
          404: {
            description: "User not found"
          }
        }
      }
    },
    "/api/auth/profile": {
      get: {
        tags: ["Auth"],
        summary: "Get current authenticated user profile",
        responses: {
          200: {
            description: "Profile data retrieved",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    user: { $ref: "#/components/schemas/User" }
                  }
                }
              }
            }
          },
          401: {
            description: "Unauthorized"
          }
        }
      }
    },
    "/api/users": {
      get: {
        tags: ["Users"],
        summary: "Get all users (Super Admin only)",
        responses: {
          200: {
            description: "List of users",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    users: {
                      type: "array",
                      items: { $ref: "#/components/schemas/User" }
                    }
                  }
                }
              }
            }
          }
        }
      },
      post: {
        tags: ["Users"],
        summary: "Create a new user (Super Admin only)",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "email", "password", "role"],
                properties: {
                  name: { type: "string", example: "Jane Smith" },
                  email: { type: "string", format: "email", example: "jane@company.com" },
                  password: { type: "string", example: "securePass12" },
                  role: { type: "string", enum: ["SUPER_ADMIN", "AUDITOR", "CLIENT"], example: "CLIENT" },
                  company_id: { type: "integer", nullable: true, example: 2 }
                }
              }
            }
          }
        },
        responses: {
          201: {
            description: "User created",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: { type: "string", example: "User created successfully" },
                    userId: { type: "integer", example: 12 }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/users/auditors": {
      get: {
        tags: ["Users"],
        summary: "Get all auditor users",
        responses: {
          200: {
            description: "Auditors list",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    auditors: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          id: { type: "integer", example: 2 },
                          name: { type: "string", example: "Auditor John" },
                          email: { type: "string", example: "auditor@cryptus.in" }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/users/{id}": {
      put: {
        tags: ["Users"],
        summary: "Update user profile (Super Admin only)",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" } }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "email", "role"],
                properties: {
                  name: { type: "string", example: "Jane Updated" },
                  email: { type: "string", example: "jane@company.com" },
                  role: { type: "string", example: "CLIENT" },
                  company_id: { type: "integer", nullable: true, example: 2 }
                }
              }
            }
          }
        },
        responses: {
          200: { description: "User updated" },
          404: { description: "User not found" }
        }
      },
      delete: {
        tags: ["Users"],
        summary: "Delete user account (Super Admin only)",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" } }
        ],
        responses: {
          200: { description: "User deleted" },
          404: { description: "User not found" }
        }
      }
    },
    "/api/companies": {
      get: {
        tags: ["Companies"],
        summary: "Get list of all companies",
        responses: {
          200: {
            description: "List of companies",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    companies: { type: "array", items: { $ref: "#/components/schemas/Company" } }
                  }
                }
              }
            }
          }
        }
      },
      post: {
        tags: ["Companies"],
        summary: "Create a new company",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name"],
                properties: {
                  name: { type: "string", example: "Acme Corp" },
                  industry: { type: "string", example: "Healthcare" },
                  website: { type: "string", example: "https://acmehealth.com" }
                }
              }
            }
          }
        },
        responses: {
          201: {
            description: "Company created successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: { type: "string", example: "Company created successfully" },
                    companyId: { type: "integer", example: 3 }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/companies/{id}": {
      get: {
        tags: ["Companies"],
        summary: "Get company by ID",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" } }
        ],
        responses: {
          200: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    company: { $ref: "#/components/schemas/Company" }
                  }
                }
              }
            }
          },
          404: { description: "Company not found" }
        }
      },
      put: {
        tags: ["Companies"],
        summary: "Update company details",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" } }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string", example: "Acme Group" },
                  industry: { type: "string", example: "Fintech & Healthcare" },
                  website: { type: "string", example: "https://acmegroup.com" }
                }
              }
            }
          }
        },
        responses: {
          200: { description: "Company updated successfully" }
        }
      },
      delete: {
        tags: ["Companies"],
        summary: "Delete company",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" } }
        ],
        responses: {
          200: { description: "Company deleted" }
        }
      }
    },
    "/api/frameworks": {
      get: {
        tags: ["Frameworks"],
        summary: "Get all compliance frameworks",
        responses: {
          200: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    frameworks: { type: "array", items: { $ref: "#/components/schemas/Framework" } }
                  }
                }
              }
            }
          }
        }
      },
      post: {
        tags: ["Frameworks"],
        summary: "Create compliance framework (Super Admin only)",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name"],
                properties: {
                  name: { type: "string", example: "ISO 27001" },
                  description: { type: "string", example: "International standard for information security management systems" }
                }
              }
            }
          }
        },
        responses: {
          201: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: { type: "string", example: "Framework created" },
                    frameworkId: { type: "integer", example: 4 }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/frameworks/{id}": {
      get: {
        tags: ["Frameworks"],
        summary: "Get framework by ID",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" } }
        ],
        responses: {
          200: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    framework: { $ref: "#/components/schemas/Framework" }
                  }
                }
              }
            }
          },
          404: { description: "Framework not found" }
        }
      },
      put: {
        tags: ["Frameworks"],
        summary: "Update framework (Super Admin only)",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" } }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  description: { type: "string" },
                  status: { type: "string", example: "ACTIVE" }
                }
              }
            }
          }
        },
        responses: {
          200: { description: "Framework updated" }
        }
      },
      delete: {
        tags: ["Frameworks"],
        summary: "Delete framework (Super Admin only)",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" } }
        ],
        responses: {
          200: { description: "Framework deleted" }
        }
      }
    },
    "/api/controls": {
      get: {
        tags: ["Controls"],
        summary: "Get all controls",
        responses: {
          200: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    controls: { type: "array", items: { $ref: "#/components/schemas/Control" } }
                  }
                }
              }
            }
          }
        }
      },
      post: {
        tags: ["Controls"],
        summary: "Create framework control (Super Admin only)",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["framework_id", "title"],
                properties: {
                  framework_id: { type: "integer", example: 1 },
                  title: { type: "string", example: "AC-1 Access Control Policy" },
                  description: { type: "string", example: "Develop, document, and disseminate an access control policy." },
                  category: { type: "string", example: "Access Control" }
                }
              }
            }
          }
        },
        responses: {
          201: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: { type: "string", example: "Control Created" },
                    controlId: { type: "integer", example: 15 }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/controls/framework/{frameworkId}": {
      get: {
        tags: ["Controls"],
        summary: "Get all controls assigned to a specific framework",
        parameters: [
          { name: "frameworkId", in: "path", required: true, schema: { type: "integer" } }
        ],
        responses: {
          200: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    controls: { type: "array", items: { $ref: "#/components/schemas/Control" } }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/controls/{id}": {
      get: {
        tags: ["Controls"],
        summary: "Get control by ID",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" } }
        ],
        responses: {
          200: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    control: { $ref: "#/components/schemas/Control" }
                  }
                }
              }
            }
          },
          404: { description: "Control not found" }
        }
      },
      put: {
        tags: ["Controls"],
        summary: "Update control details (Super Admin only)",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" } }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["title"],
                properties: {
                  title: { type: "string" },
                  description: { type: "string" },
                  category: { type: "string" }
                }
              }
            }
          }
        },
        responses: {
          200: { description: "Control updated" }
        }
      },
      delete: {
        tags: ["Controls"],
        summary: "Delete control (Super Admin only)",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" } }
        ],
        responses: {
          200: { description: "Control deleted" }
        }
      }
    },
    "/api/controls/{id}/status": {
      put: {
        tags: ["Controls"],
        summary: "Update general control status",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" } }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["status"],
                properties: {
                  status: { type: "string", example: "ACTIVE" }
                }
              }
            }
          }
        },
        responses: {
          200: { description: "Control status updated" }
        }
      }
    },
    "/api/company-frameworks/assign": {
      post: {
        tags: ["Company Frameworks"],
        summary: "Assign compliance framework to a company (Super Admin only)",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["company_id", "framework_id"],
                properties: {
                  company_id: { type: "integer", example: 3 },
                  framework_id: { type: "integer", example: 2 }
                }
              }
            }
          }
        },
        responses: {
          201: {
            description: "Framework assigned",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: { type: "string", example: "Framework assigned to company" },
                    id: { type: "integer", example: 4 }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/company-frameworks/company/{companyId}": {
      get: {
        tags: ["Company Frameworks"],
        summary: "Get frameworks assigned to a specific company",
        parameters: [
          { name: "companyId", in: "path", required: true, schema: { type: "integer" } }
        ],
        responses: {
          200: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    frameworks: { type: "array", items: { $ref: "#/components/schemas/CompanyFramework" } }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/company-frameworks/{id}": {
      delete: {
        tags: ["Company Frameworks"],
        summary: "Deassign framework from company (Super Admin only)",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" } }
        ],
        responses: {
          200: { description: "Framework deassigned successfully" }
        }
      }
    },
    "/api/company-controls/assign": {
      post: {
        tags: ["Company Controls"],
        summary: "Assign framework control to a company",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["company_id", "control_id"],
                properties: {
                  company_id: { type: "integer", example: 3 },
                  control_id: { type: "integer", example: 10 }
                }
              }
            }
          }
        },
        responses: {
          201: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: { type: "string", example: "Control assigned" },
                    id: { type: "integer", example: 5 }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/company-controls/company/{companyId}": {
      get: {
        tags: ["Company Controls"],
        summary: "Get controls assigned to a specific company",
        parameters: [
          { name: "companyId", in: "path", required: true, schema: { type: "integer" } }
        ],
        responses: {
          200: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    controls: { type: "array", items: { $ref: "#/components/schemas/CompanyControl" } }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/company-controls/{id}/status": {
      put: {
        tags: ["Company Controls"],
        summary: "Update company control compliance status",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" } }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["status"],
                properties: {
                  status: { type: "string", enum: ["PENDING", "IMPLEMENTED", "EXEMPT"], example: "IMPLEMENTED" }
                }
              }
            }
          }
        },
        responses: {
          200: { description: "Compliance status updated successfully" }
        }
      }
    },
    "/api/company-controls/score/{companyId}": {
      get: {
        tags: ["Company Controls"],
        summary: "Get cumulative compliance rating score for a company",
        parameters: [
          { name: "companyId", in: "path", required: true, schema: { type: "integer" } }
        ],
        responses: {
          200: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    score: { type: "number", example: 78.3 }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/company-controls/{id}": {
      delete: {
        tags: ["Company Controls"],
        summary: "Deassign control from company",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" } }
        ],
        responses: {
          200: { description: "Control deassigned" }
        }
      }
    },
    "/api/evidence/upload": {
      post: {
        tags: ["Evidence"],
        summary: "Upload evidence file",
        description: "Upload a file matching a company control requirement. Uses multipart/form-data. Allowed formats are handled by Multer.",
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                required: ["file"],
                properties: {
                  file: { type: "string", format: "binary", description: "The evidence file to upload" },
                  company_control_id: { type: "integer", description: "The ID of the company control this evidence applies to" },
                  title: { type: "string", description: "Short title descriptor" },
                  description: { type: "string", description: "Detailed description" }
                }
              }
            }
          }
        },
        responses: {
          201: {
            description: "Evidence uploaded",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    evidenceId: { type: "integer", example: 24 }
                  }
                }
              }
            }
          },
          400: { description: "File missing" }
        }
      }
    },
    "/api/evidence/my": {
      get: {
        tags: ["Evidence"],
        summary: "Get current user's uploaded evidence files",
        responses: {
          200: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: { type: "array", items: { $ref: "#/components/schemas/Evidence" } }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/evidence/auditor": {
      get: {
        tags: ["Evidence"],
        summary: "Get all pending/reviewed evidence from auditor's assigned companies",
        responses: {
          200: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: { type: "array", items: { $ref: "#/components/schemas/Evidence" } }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/evidence/company-control/{companyControlId}": {
      get: {
        tags: ["Evidence"],
        summary: "Get evidence files uploaded for a specific company control ID",
        parameters: [
          { name: "companyControlId", in: "path", required: true, schema: { type: "integer" } }
        ],
        responses: {
          200: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: { type: "array", items: { $ref: "#/components/schemas/Evidence" } }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/evidence/summary/{companyId}": {
      get: {
        tags: ["Evidence"],
        summary: "Get evidence statistics summary for a company",
        parameters: [
          { name: "companyId", in: "path", required: true, schema: { type: "integer" } }
        ],
        responses: {
          200: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: {
                      type: "object",
                      properties: {
                        total: { type: "integer", example: 10 },
                        approved: { type: "integer", example: 6 },
                        pending: { type: "integer", example: 3 },
                        rejected: { type: "integer", example: 1 }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/evidence/company/{companyId}": {
      get: {
        tags: ["Evidence"],
        summary: "Get all evidence associated with a company",
        parameters: [
          { name: "companyId", in: "path", required: true, schema: { type: "integer" } }
        ],
        responses: {
          200: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: { type: "array", items: { $ref: "#/components/schemas/Evidence" } }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/evidence/{id}": {
      get: {
        tags: ["Evidence"],
        summary: "Get specific evidence details by ID",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" } }
        ],
        responses: {
          200: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: { $ref: "#/components/schemas/Evidence" }
                  }
                }
              }
            }
          },
          404: { description: "Evidence not found" }
        }
      },
      delete: {
        tags: ["Evidence"],
        summary: "Delete evidence file entry",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" } }
        ],
        responses: {
          200: { description: "Evidence deleted" }
        }
      }
    },
    "/api/evidence/{id}/review": {
      put: {
        tags: ["Evidence"],
        summary: "Review evidence (Auditor/Super Admin only)",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" } }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["status", "comments"],
                properties: {
                  status: { type: "string", enum: ["APPROVED", "REJECTED"], example: "APPROVED" },
                  comments: { type: "string", example: "Firewall logs verified for current quarter." }
                }
              }
            }
          }
        },
        responses: {
          200: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: {
                      type: "object",
                      properties: {
                        id: { type: "integer", example: 10 },
                        status: { type: "string", example: "APPROVED" }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/audits": {
      get: {
        tags: ["Audits"],
        summary: "Get audits list with filters",
        parameters: [
          { name: "company_id", in: "query", schema: { type: "integer" } },
          { name: "status", in: "query", schema: { type: "string", enum: ["PLANNED", "IN_PROGRESS", "COMPLETED"] } },
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", default: 20 } },
          { name: "search", in: "query", schema: { type: "string" } }
        ],
        responses: {
          200: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    audits: { type: "array", items: { $ref: "#/components/schemas/Audit" } },
                    meta: {
                      type: "object",
                      properties: {
                        total: { type: "integer" },
                        page: { type: "integer" },
                        limit: { type: "integer" },
                        pages: { type: "integer" }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      post: {
        tags: ["Audits"],
        summary: "Create a new audit plan (Auditor/Super Admin only)",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["title", "company_id"],
                properties: {
                  title: { type: "string" },
                  description: { type: "string" },
                  framework_id: { type: "integer" },
                  company_id: { type: "integer" },
                  auditor_id: { type: "integer" },
                  status: { type: "string", enum: ["PLANNED", "IN_PROGRESS", "COMPLETED"], default: "PLANNED" },
                  start_date: { type: "string", format: "date" },
                  end_date: { type: "string", format: "date" }
                }
              }
            }
          }
        },
        responses: {
          201: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    auditId: { type: "integer", example: 5 }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/audits/{id}": {
      get: {
        tags: ["Audits"],
        summary: "Get specific audit details",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" } }
        ],
        responses: {
          200: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: { $ref: "#/components/schemas/Audit" }
                  }
                }
              }
            }
          }
        }
      },
      put: {
        tags: ["Audits"],
        summary: "Update audit (Auditor/Super Admin only)",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" } }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  description: { type: "string" },
                  framework_id: { type: "integer" },
                  company_id: { type: "integer" },
                  auditor_id: { type: "integer" },
                  status: { type: "string", enum: ["PLANNED", "IN_PROGRESS", "COMPLETED"] },
                  start_date: { type: "string", format: "date" },
                  end_date: { type: "string", format: "date" }
                }
              }
            }
          }
        },
        responses: {
          200: { description: "Audit updated" }
        }
      },
      delete: {
        tags: ["Audits"],
        summary: "Delete audit plan (Super Admin only)",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" } }
        ],
        responses: {
          200: { description: "Audit deleted" }
        }
      }
    },
    "/api/findings": {
      get: {
        tags: ["Findings"],
        summary: "Get findings list with filters",
        parameters: [
          { name: "status", in: "query", schema: { type: "string", enum: ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"] } },
          { name: "severity", in: "query", schema: { type: "string", enum: ["CRITICAL", "HIGH", "MEDIUM", "LOW"] } },
          { name: "company_id", in: "query", schema: { type: "integer" } },
          { name: "search", in: "query", schema: { type: "string" } },
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", default: 20 } }
        ],
        responses: {
          200: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    findings: { type: "array", items: { $ref: "#/components/schemas/Finding" } },
                    meta: {
                      type: "object",
                      properties: {
                        total: { type: "integer" },
                        page: { type: "integer" },
                        limit: { type: "integer" },
                        pages: { type: "integer" }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      post: {
        tags: ["Findings"],
        summary: "Create compliance finding (Auditor/Super Admin only)",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["audit_id", "company_id", "title"],
                properties: {
                  audit_id: { type: "integer" },
                  control_id: { type: "integer" },
                  company_id: { type: "integer" },
                  title: { type: "string" },
                  description: { type: "string" },
                  severity: { type: "string", enum: ["CRITICAL", "HIGH", "MEDIUM", "LOW"], default: "MEDIUM" },
                  status: { type: "string", enum: ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"], default: "OPEN" },
                  assigned_to: { type: "integer" },
                  due_date: { type: "string", format: "date" }
                }
              }
            }
          }
        },
        responses: {
          201: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    findingId: { type: "integer", example: 1 }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/findings/company/{companyId}": {
      get: {
        tags: ["Findings"],
        summary: "Get all findings for a company",
        parameters: [
          { name: "companyId", in: "path", required: true, schema: { type: "integer" } }
        ],
        responses: {
          200: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    findings: { type: "array", items: { $ref: "#/components/schemas/Finding" } }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/findings/{id}": {
      get: {
        tags: ["Findings"],
        summary: "Get specific finding",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" } }
        ],
        responses: {
          200: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: { $ref: "#/components/schemas/Finding" }
                  }
                }
              }
            }
          }
        }
      },
      put: {
        tags: ["Findings"],
        summary: "Update finding details (Auditor/Super Admin only)",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" } }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  description: { type: "string" },
                  severity: { type: "string", enum: ["CRITICAL", "HIGH", "MEDIUM", "LOW"] },
                  status: { type: "string", enum: ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"] },
                  assigned_to: { type: "integer" },
                  due_date: { type: "string", format: "date" },
                  control_id: { type: "integer" }
                }
              }
            }
          }
        },
        responses: {
          200: { description: "Finding updated" }
        }
      },
      delete: {
        tags: ["Findings"],
        summary: "Delete finding (Auditor/Super Admin only)",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" } }
        ],
        responses: {
          200: { description: "Finding deleted" }
        }
      }
    },
    "/api/risks": {
      get: {
        tags: ["Risks"],
        summary: "Get all risks in the register",
        responses: {
          200: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    risks: { type: "array", items: { $ref: "#/components/schemas/Risk" } }
                  }
                }
              }
            }
          }
        }
      },
      post: {
        tags: ["Risks"],
        summary: "Create a risk record",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["company_id", "title"],
                properties: {
                  company_id: { type: "integer" },
                  title: { type: "string" },
                  description: { type: "string" },
                  impact: { type: "string", enum: ["CRITICAL", "HIGH", "MEDIUM", "LOW"] },
                  likelihood: { type: "string", enum: ["CRITICAL", "HIGH", "MEDIUM", "LOW"] },
                  severity: { type: "string", enum: ["CRITICAL", "HIGH", "MEDIUM", "LOW"] },
                  status: { type: "string", enum: ["OPEN", "MITIGATED", "ACCEPTED", "CLOSED"] },
                  owner: { type: "string" },
                  mitigation: { type: "string" },
                  due_date: { type: "string", format: "date" }
                }
              }
            }
          }
        },
        responses: {
          201: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    riskId: { type: "integer", example: 3 }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/risks/company/{companyId}": {
      get: {
        tags: ["Risks"],
        summary: "Get all risks for a company",
        parameters: [
          { name: "companyId", in: "path", required: true, schema: { type: "integer" } }
        ],
        responses: {
          200: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    risks: { type: "array", items: { $ref: "#/components/schemas/Risk" } }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/risks/{id}": {
      get: {
        tags: ["Risks"],
        summary: "Get risk details",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" } }
        ],
        responses: {
          200: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    risk: { $ref: "#/components/schemas/Risk" }
                  }
                }
              }
            }
          }
        }
      },
      put: {
        tags: ["Risks"],
        summary: "Update risk details",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" } }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  description: { type: "string" },
                  impact: { type: "string", enum: ["CRITICAL", "HIGH", "MEDIUM", "LOW"] },
                  likelihood: { type: "string", enum: ["CRITICAL", "HIGH", "MEDIUM", "LOW"] },
                  severity: { type: "string", enum: ["CRITICAL", "HIGH", "MEDIUM", "LOW"] },
                  status: { type: "string", enum: ["OPEN", "MITIGATED", "ACCEPTED", "CLOSED"] },
                  owner: { type: "string" },
                  mitigation: { type: "string" },
                  due_date: { type: "string", format: "date" }
                }
              }
            }
          }
        },
        responses: {
          200: { description: "Risk updated" }
        }
      },
      delete: {
        tags: ["Risks"],
        summary: "Delete risk record",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" } }
        ],
        responses: {
          200: { description: "Risk deleted" }
        }
      }
    },
    "/api/tasks": {
      get: {
        tags: ["Tasks"],
        summary: "Get all tasks",
        responses: {
          200: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    tasks: { type: "array", items: { $ref: "#/components/schemas/Task" } }
                  }
                }
              }
            }
          }
        }
      },
      post: {
        tags: ["Tasks"],
        summary: "Create a compliance action task",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["company_id", "title"],
                properties: {
                  company_id: { type: "integer" },
                  control_id: { type: "integer" },
                  assigned_to: { type: "integer" },
                  title: { type: "string" },
                  description: { type: "string" },
                  due_date: { type: "string", format: "date" },
                  priority: { type: "string", enum: ["HIGH", "MEDIUM", "LOW"], default: "MEDIUM" },
                  status: { type: "string", enum: ["TODO", "IN_PROGRESS", "DONE"], default: "TODO" }
                }
              }
            }
          }
        },
        responses: {
          201: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    taskId: { type: "integer", example: 4 }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/tasks/{id}": {
      get: {
        tags: ["Tasks"],
        summary: "Get specific task details",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" } }
        ],
        responses: {
          200: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    task: { $ref: "#/components/schemas/Task" }
                  }
                }
              }
            }
          }
        }
      },
      put: {
        tags: ["Tasks"],
        summary: "Update task details/status",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" } }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  description: { type: "string" },
                  due_date: { type: "string", format: "date" },
                  priority: { type: "string", enum: ["HIGH", "MEDIUM", "LOW"] },
                  status: { type: "string", enum: ["TODO", "IN_PROGRESS", "DONE"] },
                  assigned_to: { type: "integer" }
                }
              }
            }
          }
        },
        responses: {
          200: { description: "Task updated" }
        }
      },
      delete: {
        tags: ["Tasks"],
        summary: "Delete task",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" } }
        ],
        responses: {
          200: { description: "Task deleted" }
        }
      }
    },
    "/api/notifications": {
      get: {
        tags: ["Notifications"],
        summary: "Get notifications for logged-in user",
        responses: {
          200: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    notifications: { type: "array", items: { $ref: "#/components/schemas/Notification" } }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/notifications/{id}/read": {
      put: {
        tags: ["Notifications"],
        summary: "Mark notification as read",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" } }
        ],
        responses: {
          200: { description: "Notification marked as read" }
        }
      }
    },
    "/api/notifications/{id}": {
      delete: {
        tags: ["Notifications"],
        summary: "Delete notification",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" } }
        ],
        responses: {
          200: { description: "Notification deleted" }
        }
      }
    },
    "/api/dashboard/client": {
      get: {
        tags: ["Dashboard"],
        summary: "Get client dashboard metrics and overview status",
        responses: {
          200: {
            description: "Client dashboard data"
          }
        }
      }
    },
    "/api/dashboard/admin": {
      get: {
        tags: ["Dashboard"],
        summary: "Get Super Admin dashboard overview metrics",
        responses: {
          200: {
            description: "Admin dashboard metrics"
          }
        }
      }
    },
    "/api/dashboard/auditor": {
      get: {
        tags: ["Dashboard"],
        summary: "Get auditor-specific compliance overview dashboard data",
        responses: {
          200: {
            description: "Auditor dashboard data"
          }
        }
      }
    },
    "/api/reports/compliance/{companyId}": {
      get: {
        tags: ["Reports"],
        summary: "Get complete compliance aggregation report data for a company",
        parameters: [
          { name: "companyId", in: "path", required: true, schema: { type: "integer" } }
        ],
        responses: {
          200: {
            description: "Compliance report data",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: {
                      type: "object",
                      properties: {
                        generatedAt: { type: "string", format: "date-time" },
                        company: { type: "object", properties: { id: { type: "integer" }, name: { type: "string" } } },
                        frameworks: { type: "array", items: { type: "object" } },
                        controls: { type: "object", additionalProperties: { type: "integer" } },
                        evidence: { type: "object", additionalProperties: { type: "integer" } },
                        findings: { type: "array", items: { type: "object" } },
                        risks: { type: "array", items: { type: "object" } }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/reports/audit/{auditId}": {
      get: {
        tags: ["Reports"],
        summary: "Get audit summary report data including findings counts",
        parameters: [
          { name: "auditId", in: "path", required: true, schema: { type: "integer" } }
        ],
        responses: {
          200: {
            description: "Audit report data"
          }
        }
      }
    },
    "/api/reports/risk/{companyId}": {
      get: {
        tags: ["Reports"],
        summary: "Get company risk registry report summary data",
        parameters: [
          { name: "companyId", in: "path", required: true, schema: { type: "integer" } }
        ],
        responses: {
          200: {
            description: "Risk registry report data"
          }
        }
      }
    }
  }
};

export default swaggerDocument;
