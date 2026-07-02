import express from "express";

import protect
from "../middleware/auth.middleware.js";

import {
    assignControl,
    getCompanyControls,
    updateControlStatus,
    getComplianceScore,
    deassignControl
}
from "../controllers/companyControl.controller.js";

const router =
express.Router();

router.post(
    "/assign",
    protect,
    assignControl
);

router.get(
    "/company/:companyId",
    protect,
    getCompanyControls
);

router.put(
    "/:id/status",
    protect,
    updateControlStatus
);

router.get(
    "/score/:companyId",
    protect,
    getComplianceScore
);

router.delete(
    "/:id",
    protect,
    deassignControl
);

export default router;