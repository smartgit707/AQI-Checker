import {
  getUserProfile,
  updateUserProfile,
  changePassword,
  deleteUserAccount,
  getFavoriteCities,
  addFavoriteCity,
  removeFavoriteCity,
  getRecentCities,
  addRecentCity,
  getUserDashboard
} from '../services/userService.js';

export async function getProfile(req, res, next) {
  try {
    const user = await getUserProfile(req.user.id);
    return res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
}

export async function updateProfile(req, res, next) {
  try {
    const updated = await updateUserProfile(req.user.id, req.body);
    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: updated
    });
  } catch (error) {
    next(error);
  }
}

export async function updatePassword(req, res, next) {
  try {
    const { currentPassword, newPassword } = req.body;
    await changePassword(req.user.id, { currentPassword, newPassword });
    return res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteAccount(req, res, next) {
  try {
    await deleteUserAccount(req.user.id);
    res.clearCookie('token');
    return res.status(200).json({
      success: true,
      message: 'Account deleted permanently'
    });
  } catch (error) {
    next(error);
  }
}

export async function getFavorites(req, res, next) {
  try {
    const favorites = await getFavoriteCities(req.user.id);
    return res.status(200).json({
      success: true,
      count: favorites.length,
      favorites
    });
  } catch (error) {
    next(error);
  }
}

export async function addFavorite(req, res, next) {
  try {
    const slug = req.params.slug || req.body.slug;
    if (!slug) {
      return res.status(400).json({ success: false, message: 'City slug is required' });
    }
    const favoriteCities = await addFavoriteCity(req.user.id, slug);
    return res.status(200).json({
      success: true,
      message: `Added ${slug} to favorites`,
      favoriteCities
    });
  } catch (error) {
    next(error);
  }
}

export async function removeFavorite(req, res, next) {
  try {
    const { slug } = req.params;
    const favoriteCities = await removeFavoriteCity(req.user.id, slug);
    return res.status(200).json({
      success: true,
      message: `Removed ${slug} from favorites`,
      favoriteCities
    });
  } catch (error) {
    next(error);
  }
}

export async function getRecent(req, res, next) {
  try {
    const recent = await getRecentCities(req.user.id);
    return res.status(200).json({
      success: true,
      recent
    });
  } catch (error) {
    next(error);
  }
}

export async function recordRecent(req, res, next) {
  try {
    const slug = req.params.slug || req.body.slug;
    if (!slug) {
      return res.status(400).json({ success: false, message: 'City slug is required' });
    }
    const recentCities = await addRecentCity(req.user.id, slug);
    return res.status(200).json({
      success: true,
      recentCities
    });
  } catch (error) {
    next(error);
  }
}

export async function getDashboard(req, res, next) {
  try {
    const dashboard = await getUserDashboard(req.user.id);
    return res.status(200).json({
      success: true,
      dashboard
    });
  } catch (error) {
    next(error);
  }
}
