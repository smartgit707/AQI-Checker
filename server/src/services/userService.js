import * as userRepository from '../db/repositories/userRepository.js';
import { isDBConnected } from '../config/db.js';
import { getInMemoryUsers, sanitizeUser, hashPassword, comparePassword } from './authService.js';
import { getLatestAirQualityForCity } from './airQualityService.js';
import { getCityBySlug } from './cityService.js';

/**
 * Find user document or in-memory object by ID
 */
export async function findUserById(userId) {
  if (isDBConnected()) {
    return await userRepository.findUserById(userId);
  }

  const users = getInMemoryUsers();
  for (const user of users.values()) {
    if (user._id === userId || user.id === userId) {
      return user;
    }
  }
  return null;
}

/**
 * Get sanitized user profile
 */
export async function getUserProfile(userId) {
  const user = await findUserById(userId);
  if (!user) {
    throw new Error('User not found');
  }
  return sanitizeUser(user);
}

/**
 * Update user basic profile
 */
export async function updateUserProfile(userId, { name, avatar, settings }) {
  if (isDBConnected()) {
    const updated = await userRepository.updateUser(userId, { name, avatar, settings });
    if (!updated) throw new Error('User not found');
    return sanitizeUser(updated);
  }

  const user = await findUserById(userId);
  if (!user) throw new Error('User not found');

  if (name) user.name = name.trim();
  if (avatar !== undefined) user.avatar = avatar;
  if (settings) {
    user.settings = { ...user.settings, ...settings };
  }
  user.updatedAt = new Date();

  return sanitizeUser(user);
}

/**
 * Change user password
 */
export async function changePassword(userId, { currentPassword, newPassword }) {
  if (!newPassword || newPassword.length < 6) {
    throw new Error('New password must be at least 6 characters long');
  }

  const user = await findUserById(userId);
  if (!user) throw new Error('User not found');

  const isMatch = await comparePassword(currentPassword, user.passwordHash);
  if (!isMatch) {
    throw new Error('Current password is incorrect');
  }

  const newHash = await hashPassword(newPassword);

  if (isDBConnected()) {
    await userRepository.updatePassword(userId, newHash);
    return true;
  }

  user.passwordHash = newHash;
  user.updatedAt = new Date();
  return true;
}

/**
 * Delete user account permanently
 */
export async function deleteUserAccount(userId) {
  if (isDBConnected()) {
    return await userRepository.deleteUser(userId);
  }

  const users = getInMemoryUsers();
  for (const [email, user] of users.entries()) {
    if (user._id === userId || user.id === userId) {
      users.delete(email);
      return true;
    }
  }
  return false;
}

/**
 * Get enriched favorite cities
 */
export async function getFavoriteCities(userId) {
  const user = await findUserById(userId);
  if (!user) throw new Error('User not found');

  const slugs = user.favoriteCities || [];
  if (slugs.length === 0) return [];

  // Resolve telemetry for each favorite city in parallel
  const enriched = await Promise.all(
    slugs.map(async (slug) => {
      try {
        const [cityInfo, telemetry] = await Promise.all([
          getCityBySlug(slug),
          getLatestAirQualityForCity(slug)
        ]);

        return {
          slug,
          name: cityInfo?.name || telemetry?.cityName || slug.toUpperCase(),
          state: cityInfo?.state || telemetry?.state || 'India',
          image: cityInfo?.image || null,
          aqi: telemetry?.aqi ?? 0,
          category: telemetry?.category || 'Moderate',
          primaryPollutant: telemetry?.primaryPollutant || 'PM2.5',
          temperature: telemetry?.weather?.temperature ?? 26,
          humidity: telemetry?.weather?.humidity ?? 50,
          weatherCondition: telemetry?.weather?.condition || 'Clear',
          timestamp: telemetry?.timestamp || new Date()
        };
      } catch (err) {
        return {
          slug,
          name: slug.toUpperCase(),
          state: 'India',
          aqi: 75,
          category: 'Moderate',
          primaryPollutant: 'PM2.5',
          temperature: 25,
          humidity: 50,
          weatherCondition: 'Clear',
          timestamp: new Date()
        };
      }
    })
  );

  return enriched;
}

/**
 * Add a city to user favorites
 */
export async function addFavoriteCity(userId, citySlug) {
  const cleanSlug = citySlug.trim().toLowerCase();
  const user = await findUserById(userId);
  if (!user) throw new Error('User not found');

  const favorites = user.favoriteCities || [];
  if (favorites.includes(cleanSlug)) {
    return favorites; // Already in favorites
  }

  if (favorites.length >= 10) {
    throw new Error('Maximum limit of 10 favorite cities reached');
  }

  if (isDBConnected()) {
    return await userRepository.addUserFavorite(userId, cleanSlug);
  }

  user.favoriteCities = [...favorites, cleanSlug];
  user.updatedAt = new Date();
  return user.favoriteCities;
}

/**
 * Remove a city from user favorites
 */
export async function removeFavoriteCity(userId, citySlug) {
  const cleanSlug = citySlug.trim().toLowerCase();
  const user = await findUserById(userId);
  if (!user) throw new Error('User not found');

  if (isDBConnected()) {
    return await userRepository.removeUserFavorite(userId, cleanSlug);
  }

  user.favoriteCities = (user.favoriteCities || []).filter((s) => s !== cleanSlug);
  user.updatedAt = new Date();
  return user.favoriteCities;
}

/**
 * Record a visited city into recent history (capped at 10, bump to top)
 */
export async function addRecentCity(userId, citySlug) {
  const cleanSlug = citySlug.trim().toLowerCase();
  const user = await findUserById(userId);
  if (!user) return [];

  if (isDBConnected()) {
    const list = await userRepository.addUserRecentCity(userId, cleanSlug);
    return list;
  }

  const existing = user.recentCities || [];
  const filtered = existing.filter((item) => item.slug !== cleanSlug);
  const updated = [{ slug: cleanSlug, visitedAt: new Date() }, ...filtered].slice(0, 10);

  user.recentCities = updated;
  user.updatedAt = new Date();
  return user.recentCities;
}

/**
 * Get enriched recent cities
 */
export async function getRecentCities(userId) {
  const user = await findUserById(userId);
  if (!user) throw new Error('User not found');

  const recent = user.recentCities || [];
  if (recent.length === 0) return [];

  const resolved = await Promise.all(
    recent.map(async (item) => {
      const city = await getCityBySlug(item.slug);
      return {
        slug: item.slug,
        visitedAt: item.visitedAt,
        name: city?.name || item.slug.toUpperCase(),
        state: city?.state || 'India',
        image: city?.image || null
      };
    })
  );

  return resolved;
}

/**
 * Get complete personalized environmental dashboard payload
 */
export async function getUserDashboard(userId) {
  const user = await findUserById(userId);
  if (!user) throw new Error('User not found');

  const [favorites, recent] = await Promise.all([
    getFavoriteCities(userId),
    getRecentCities(userId)
  ]);

  // Aggregate stats across favorite cities
  let averageAqi = 0;
  let cleanestCity = null;
  let highestRiskCity = null;

  if (favorites.length > 0) {
    const totalAqi = favorites.reduce((acc, curr) => acc + (curr.aqi || 0), 0);
    averageAqi = Math.round(totalAqi / favorites.length);

    const sortedByAqi = [...favorites].sort((a, b) => a.aqi - b.aqi);
    cleanestCity = sortedByAqi[0];
    highestRiskCity = sortedByAqi[sortedByAqi.length - 1];
  }

  return {
    user: sanitizeUser(user),
    favorites,
    recent,
    metrics: {
      totalFavorites: favorites.length,
      averageAqi,
      cleanestCity: cleanestCity ? { name: cleanestCity.name, slug: cleanestCity.slug, aqi: cleanestCity.aqi } : null,
      highestRiskCity: highestRiskCity ? { name: highestRiskCity.name, slug: highestRiskCity.slug, aqi: highestRiskCity.aqi } : null
    }
  };
}
