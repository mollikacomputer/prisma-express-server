import { Router } from "express";
import { premiumController } from "./premium.controller";
import { auth } from "../../middleware/auth";
import { Role, SubscriptionStatus } from "../../../generated/prisma/enums";

import { subscriptionGuard } from "../../middleware/premiumGuard";


const router = Router();
router.get(
    "/",
    auth(Role.ADMIN, Role.AUTHOR, Role.USER),
    subscriptionGuard(),
    premiumController.getPremiumContent
)
export const premiumRoutes = router;