import express from "express";
import { rankApplicants, upload } from "../controllers/rankController.js";

const router = express.Router();

// Using upload.none() if you are only sending text data,
// or upload.single('file') if you are uploading a resume to rank.
router.post("/:jobId/rank", upload.none(), rankApplicants);

export default router;
