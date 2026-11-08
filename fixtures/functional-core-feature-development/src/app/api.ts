import { defineApiOperation } from '@gost-kit/common';
import type { StaffMember } from './contracts.js';

// Existing synthetic API boundary: wire DTO is not the domain entity.
type StaffDto = { staff_id: number; full_name: string };
export type Paths = {
  '/staff': { get: { responses: { 200: { content: { 'application/json': StaffDto[] } } } } };
};
export const loadStaff = defineApiOperation<Paths>()({
  method: 'get', url: '/staff',
  mapResponse: (rows): StaffMember[] => rows.map((row) => ({
    id: String(row.staff_id), name: row.full_name,
  })),
});
export type AppApiOperation = typeof loadStaff;
