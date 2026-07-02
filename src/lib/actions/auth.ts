"use server";

import bcrypt from "bcrypt";
import crypto from "crypto";
import prisma from "@/lib/db";
import { signIn, signOut as authSignOut } from "@/auth";
import { sendPasswordResetEmail } from "@/lib/email";
import { 
  signUpSchema, 
  loginSchema, 
  SignUpInput, 
  LoginInput,
  requestPasswordResetSchema,
  resetPasswordSchema,
  RequestPasswordResetInput,
  ResetPasswordInput,
} from "@/lib/validation/auth";
import { ActionResult } from "./types";
import { revalidatePath } from "next/cache";
import { AuthError } from "next-auth";

/**
 * Handles new vendor registration.
 * Hashes password and initializes a session via Auth.js.
 */
export async function signUp(input: SignUpInput): Promise<ActionResult<{ userId: string }>> {
  try {
    // 1. Validate input
    const validated = signUpSchema.safeParse(input);
    if (!validated.success) {
      return { success: false, error: validated.error.issues[0].message };
    }

    const { fullName, businessName, email, password } = validated.data;

    // 2. Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { success: false, error: "A user with this email already exists." };
    }

    // 3. Hash password (Security Rules)
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 4. Create user
    const user = await prisma.user.create({
      data: {
        fullName,
        businessName,
        email,
        password: hashedPassword,
      },
    });

    // 5. Sign in automatically
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    return { success: true, data: { userId: user.id } };
  } catch (error) {
    if (error instanceof AuthError) {
      return { success: false, error: "Cloud not sign in after registration." };
    }
    console.error("Signup error:", error);
    return { success: false, error: "An unexpected error occurred during signup." };
  }
}

/**
 * Handles vendor login.
 */
export async function login(input: LoginInput): Promise<ActionResult<{ userId: string }>> {
  try {
    const validated = loginSchema.safeParse(input);
    if (!validated.success) {
      return { success: false, error: validated.error.issues[0].message };
    }

    const { email, password } = validated.data;

    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    // We need to fetch the user to return the ID as per original structure, 
    // though Auth.js handles the session.
    const user = await prisma.user.findUnique({ where: { email } });

    return { success: true, data: { userId: user!.id } };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { success: false, error: "Incorrect email or password." };
        default:
          return { success: false, error: "Something went wrong during login." };
      }
    }
    throw error; // Rethrow next-redirects if any (though we used redirect: false)
  }
}

/**
 * Destroys the current session.
 */
export async function signOut() {
  await authSignOut({ redirectTo: "/auth" });
}

export async function requestPasswordReset(input: RequestPasswordResetInput): Promise<ActionResult> {
  try {
    const validated = requestPasswordResetSchema.safeParse(input);
    if (!validated.success) {
      return { success: false, error: validated.error.issues[0].message };
    }

    const { email } = validated.data;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return { success: true, data: undefined };
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await prisma.passwordResetToken.create({
      data: { email, token, expiresAt },
    });

    await sendPasswordResetEmail(email, token);

    return { success: true, data: undefined };
  } catch (error) {
    console.error("Password reset request error:", error);
    return { success: false, error: "An unexpected error occurred." };
  }
}

export async function resetPassword(input: ResetPasswordInput): Promise<ActionResult> {
  try {
    const validated = resetPasswordSchema.safeParse(input);
    if (!validated.success) {
      return { success: false, error: validated.error.issues[0].message };
    }

    const { token, password } = validated.data;

    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
    });

    if (!resetToken) {
      return { success: false, error: "Invalid or expired reset token." };
    }

    if (resetToken.used) {
      return { success: false, error: "This reset link has already been used." };
    }

    if (resetToken.expiresAt < new Date()) {
      return { success: false, error: "This reset link has expired." };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.$transaction([
      prisma.user.update({
        where: { email: resetToken.email },
        data: { password: hashedPassword },
      }),
      prisma.passwordResetToken.update({
        where: { id: resetToken.id },
        data: { used: true },
      }),
    ]);

    return { success: true, data: undefined };
  } catch (error) {
    console.error("Password reset error:", error);
    return { success: false, error: "An unexpected error occurred." };
  }
}
