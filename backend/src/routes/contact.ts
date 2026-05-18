import { Router } from "express";
import { Contact } from "../models/Contact.js";
import { contactSchema } from "../schemas/index.js";

const router = Router();

router.post("/", async (req, res, next) => {
  try {
    const data = contactSchema.parse(req.body);
    await Contact.create(data);
    res.status(201).json({ success: true, message: "We'll be in touch!" });
  } catch (err: any) {
    if (err.name === "ZodError") {
      res.status(400).json({ error: err.errors[0].message });
      return;
    }
    next(err);
  }
});

export default router;
