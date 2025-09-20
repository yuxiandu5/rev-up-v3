import { Role } from "./dtos";

export interface AdminUserListItemDTO {
  id: string;
  userName: string;
  isActive: boolean;
  role: Role;
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string | null;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface AdminUserListResponse {
  success: boolean;
  message: string;
  data: AdminUserListItemDTO[];
  meta: PaginationMeta;
}
