"use server";

import { redirect } from "next/navigation";
import { createAdminSession, destroyAdminSession, isAdminAuthenticated, verifyAdminPassword } from "@/lib/admin-auth";
import { triggerLocalTestRun } from "@/lib/services/test-runs";

export async function adminLoginAction(formData: FormData) {
  const password = String(formData.get("password") ?? "");

  if (!verifyAdminPassword(password)) {
    redirect(`/admin/login?error=${encodeURIComponent("Incorrect password.")}`);
  }

  await createAdminSession();
  redirect("/admin");
}

export async function adminLogoutAction() {
  await destroyAdminSession();
  redirect("/admin/login");
}

export async function triggerTestRunAction(formData: FormData) {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  const selectedTestIds = formData.getAll("tests").map(String);
  if (selectedTestIds.length === 0) {
    redirect(`/admin?error=${encodeURIComponent("Select at least one test to run.")}`);
  }

  const run = await triggerLocalTestRun(selectedTestIds);
  redirect(`/admin/runs/${run.id}`);
}
