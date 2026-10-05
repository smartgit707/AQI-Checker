import DataSource from '../models/DataSource.js';
import { isDBConnected } from '../config/db.js';
import { INITIAL_DATA_SOURCES } from '../utils/seedData.js';

/**
 * Data Source Service Layer
 * Returns active monitoring networks and regulatory standards.
 */

export async function getAllDataSources() {
  if (isDBConnected()) {
    return await DataSource.find({ active: true }).sort({ name: 1 });
  }

  return INITIAL_DATA_SOURCES;
}

export async function getDataSourceById(id) {
  if (isDBConnected()) {
    return await DataSource.findById(id);
  }

  return INITIAL_DATA_SOURCES.find(s => s._id === id) || null;
}
