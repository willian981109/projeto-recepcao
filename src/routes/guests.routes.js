import express from 'express';
import multer from 'multer';

import authorize from '../middlewares/authorize.js';
import * as guestsController from '../controllers/guests.controller.js';

const upload = multer({ dest: "uploads/" });
const router = express.Router();
/**
 * CHECK-IN
 * ADMIN e RECEPÇÃO
 */
router.post(
  "/checkin",
  authorize(["RECEPCAO", "ADMIN"]),
  guestsController.checkin
);

router.post(
  "/checkin/override",
  authorize(["ADMIN", "RECEPCAO"]),
  guestsController.checkinOverride
);

/**
 * LISTAR CONVIDADOS DO EVENTO
 * ADMIN e RECEPÇÃO
 * (autocomplete / validação)
 */
router.get(
  "/events/:eventId/guests",
  authorize(["ADMIN", "RECEPCAO", "CHECKIN"]),
  guestsController.listGuests
);

/**
 * CRIAR CONVIDADO MANUAL
 * ADMIN e RECEPÇÃO
 */
router.post(
  "/events/:eventId/guests",
  authorize(["ADMIN", "RECEPCAO"]),
  guestsController.createGuest
);

/**
 * IMPORTAR CONVIDADOS VIA CSV
 * SOMENTE ADMIN
 */
router.post(
  "/import/:eventId",
  authorize(["ADMIN"]),
  upload.single("file"),
  guestsController.importGuests
);

export default router;
