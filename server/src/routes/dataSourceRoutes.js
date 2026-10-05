import express from 'express';
import * as dataSourceController from '../controllers/dataSourceController.js';

const router = express.Router();

router.get('/', dataSourceController.getDataSources);
router.get('/:id', dataSourceController.getDataSourceById);

export default router;
