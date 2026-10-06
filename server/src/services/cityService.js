import * as cityRepository from '../db/repositories/cityRepository.js';
import { isDBConnected } from '../config/db.js';
import { INITIAL_CITIES } from '../utils/seedData.js';

/**
 * City Service Layer
 * Abstracts database interactions. Automatically falls back to in-memory mock catalog if MySQL is unavailable.
 */

export async function getAllCities(options = {}) {
  const { search = '', state = '', limit = 20, page = 1 } = options;

  if (isDBConnected()) {
    const result = await cityRepository.findAllCities({ search, state, limit, page });
    return {
      cities: result.cities,
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages
      }
    };
  }

  // In-Memory Fallback Mode
  let filtered = [...INITIAL_CITIES];
  if (search) {
    const s = search.toLowerCase();
    filtered = filtered.filter(c => c.name.toLowerCase().includes(s) || c.state.toLowerCase().includes(s));
  }
  if (state) {
    const st = state.toLowerCase();
    filtered = filtered.filter(c => c.state.toLowerCase().includes(st));
  }

  const total = filtered.length;
  const skip = (Math.max(1, page) - 1) * Math.max(1, limit);
  const paged = filtered.slice(skip, skip + Number(limit));

  return {
    cities: paged,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
}

export async function getCityBySlug(slug) {
  if (isDBConnected()) {
    return await cityRepository.findCityBySlug(slug);
  }

  return INITIAL_CITIES.find(c => c.slug === slug.toLowerCase()) || null;
}

export async function getCityById(id) {
  if (isDBConnected()) {
    return await cityRepository.findCityById(id);
  }

  return INITIAL_CITIES.find(c => c._id === id || c.slug === id) || null;
}

export async function createCity(data) {
  if (!isDBConnected()) {
    const newCity = {
      _id: `demo_${Date.now()}`,
      ...data,
      slug: data.slug || data.name.toLowerCase().replace(/\s+/g, '-'),
      isActive: true,
      createdAt: new Date().toISOString()
    };
    INITIAL_CITIES.push(newCity);
    return newCity;
  }

  return await cityRepository.insertCity(data);
}

export async function updateCity(id, updateData) {
  if (!isDBConnected()) {
    const idx = INITIAL_CITIES.findIndex(c => c._id === id || c.slug === id);
    if (idx === -1) return null;
    INITIAL_CITIES[idx] = { ...INITIAL_CITIES[idx], ...updateData, updatedAt: new Date().toISOString() };
    return INITIAL_CITIES[idx];
  }

  return await cityRepository.updateCityById(id, updateData);
}

export async function deleteCity(id) {
  if (!isDBConnected()) {
    const idx = INITIAL_CITIES.findIndex(c => c._id === id || c.slug === id);
    if (idx === -1) return false;
    INITIAL_CITIES.splice(idx, 1);
    return true;
  }

  return await cityRepository.deleteCityById(id);
}
