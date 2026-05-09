import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { env } from "@/lib/env";

export const metadata: Metadata = {
  title: "Forgot password",
  description: "Reset your password.",
};

export default function ForgotPasswordPage() {
  const wpResetUrl = env.WP_API_URL ? `${env.WP_API_URL}/wp-login.php?action=lostpassword` : "#";
  return (
    <Card>
      <CardHeader>
        <CardTitle>Reset your password</CardTitle>
        <CardDescription>
          Password resets are handled by WordPress. We&apos;ll send you to the secure reset page on
          the backend.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button asChild className="w-full">
          <a href={wpResetUrl} target="_blank" rel="noreferrer">
            Continue to password reset
          </a>
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          <Link href="/login" className="hover:text-primary">
            Back to sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
