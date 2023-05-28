import { Router } from "express";
import { getAllContent, getCurrencyInfo } from "../controllers/cryptoControllers.js";

const router = Router();


router.get("/:api2/:currency", getCurrencyInfo);
router.get("/:api2", getAllContent);

router.all("/*",(req, res, next)=> {
  res.status(404).send("endpoint is not supported")
} )

export default router;
