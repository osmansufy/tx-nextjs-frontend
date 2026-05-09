import { env } from "@/lib/env";

const lms = `/${env.LMS_NAMESPACE}`;
const wp = `/wp/v2`;
const jwt = `/jwt-auth/v1`;

export const endpoints = {
  auth: {
    token: `${jwt}/token`,
    validate: `${jwt}/token/validate`,
    register: `${wp}/users/register`,
    me: `${wp}/users/me`,
  },
  courses: {
    list: `${lms}/courses`,
    detail: (idOrSlug: string | number) => `${lms}/courses/${idOrSlug}`,
    curriculum: (idOrSlug: string | number) => `${lms}/courses/${idOrSlug}/curriculum`,
    progress: (id: number) => `${lms}/courses/${id}/progress`,
    categories: `${lms}/categories`,
  },
  lessons: {
    detail: (id: number) => `${lms}/lessons/${id}`,
    complete: (id: number) => `${lms}/lessons/${id}/complete`,
    uncomplete: (id: number) => `${lms}/lessons/${id}/uncomplete`,
  },
  enrollments: {
    create: `${lms}/enrollments`,
    me: `${lms}/enrollments/me`,
    detail: (id: number) => `${lms}/enrollments/${id}`,
    delete: (id: number) => `${lms}/enrollments/${id}`,
  },
  user: {
    me: `${wp}/users/me`,
    update: `${wp}/users/me`,
  },
} as const;
