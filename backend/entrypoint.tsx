/**
 * Backend entrypoint:
 * This module provides a default export that defines the UI that is returned from the backend
 * when a page is visited
 */
import { provideRedirect } from "uix/providers/common.tsx";
import { type Entrypoint } from "uix/providers/entrypoints.ts";
import { login, logout, register } from "backend/user-data.ts";

export default {
  // show backend (hybrid) rendered page on /backend
  "/backend": import("common/page.tsx"),
  "register": register,
  "login": login,
  "logout": logout,
  // redirect / to /backend
  "/": provideRedirect("/homepage"),
} satisfies Entrypoint;
