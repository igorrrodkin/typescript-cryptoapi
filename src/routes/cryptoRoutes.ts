import { Router } from "express";
import { getAllContent, getCurrencyInfo } from "../controllers/cryptoControllers.js";

const router = Router();


router.get("/:api/:currency", getCurrencyInfo);
router.get("/:api", getAllContent);

router.all("/*",(req, res, next)=> {
  res.status(404).send("endpoint is not supported")
} )

export default router;
