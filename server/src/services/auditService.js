import AuditLog from '../models/AuditLog.js';
import { isDBConnected } from '../config/db.js';

/**
 * Resilient In-Memory Audit Store
 */
const IN_MEMORY_AUDIT_LOGS = [
  {
    _id: 'audit_init_001',
    actorUserId: 'system',
    actorEmail: 'system@aerosense.air',
    action: 'SYSTEM_BOOTSTRAP',
    resourceType: 'system',
    resourceId: 'aerosense-core',
    details: { message: 'Part 7 Advanced Intelligence & Admin Layer initialized.' },
    ipAddress: '127.0.0.1',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2)
  }
];

export async function logAdminAction(entry = {}) {
  const { actorUserId, actorEmail, action, resourceType, resourceId = '', details = {}, ipAddress = '' } = entry;

  if (isDBConnected()) {
    const log = new AuditLog({
      actorUserId,
      actorEmail,
      action,
      resourceType,
      resourceId,
      details,
      ipAddress
    });
    return await log.save();
  }

  const logEntry = {
    _id: `audit_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    actorUserId,
    actorEmail,
    action,
    resourceType,
    resourceId,
    details,
    ipAddress,
    createdAt: new Date()
  };

  IN_MEMORY_AUDIT_LOGS.unshift(logEntry);
  return logEntry;
}

export async function getAuditLogs(options = {}) {
  const page = Math.max(1, Number(options.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(options.limit) || 20));
  const skip = (page - 1) * limit;

  if (isDBConnected()) {
    const query = {};
    if (options.action) query.action = options.action;
    if (options.resourceType) query.resourceType = options.resourceType;

    const [logs, total] = await Promise.all([
      AuditLog.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      AuditLog.countDocuments(query)
    ]);

    return {
      logs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  let filtered = [...IN_MEMORY_AUDIT_LOGS];
  if (options.action) {
    filtered = filtered.filter((l) => l.action === options.action);
  }
  if (options.resourceType) {
    filtered = filtered.filter((l) => l.resourceType === options.resourceType);
  }

  const total = filtered.length;
  const logs = filtered.slice(skip, skip + limit);

  return {
    logs,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
}
