"use client";

import { useState, useId } from "react";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EyeIcon, EyeOffIcon, LoaderCircleIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function LoginDialog({
  onSuccess,
  onError,
}: {
  onSuccess?: (msg: string) => void;
  onError?: (msg: string) => void;
}) {
  const id = useId();
  const [email, SetEmail] = useState("");
  const [password, SetPassword] = useState("");
  const [showPassword, SetShowPassword] = useState(false);
  const [loading, SetLoading] = useState(false);
  const [open, SetOpen] = useState(false);
  const [validation_errors, SetValidationErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const BACKEND_URL = import.meta.env.VITE_NOTIFICA_BACKEND_WEB_SERVICE_URL;
  const navigate = useNavigate();

  const handle_login = async () => {
    SetLoading(true);

    const are_fields_valid = () => {
      const new_validation_errors: { email?: string; password?: string } = {};

      if (!email) {
        new_validation_errors.email = "El correo es obligatorio.";
      } else if (!/^\S+@\S+\.\S+$/.test(email)) {
        new_validation_errors.email = "Correo inválido.";
      }

      if (!password) {
        new_validation_errors.password = "La contraseña es obligatoria.";
      }

      SetValidationErrors(new_validation_errors);
      return Object.keys(new_validation_errors).length === 0;
    };

    if (!are_fields_valid()) {
      SetLoading(false);
      return;
    }

    try {
      const res = await fetch(`${BACKEND_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        const { token, user } = await res.json();
        localStorage.setItem("access_token", token);

        // NOTE: Give some time for the spinner to show
        setTimeout(() => {
          onSuccess?.("Inicio de sesión exitoso");
          SetOpen(false);

          if (user.subscriptionStatus === "ACTIVE") {
            navigate("/dashboard");
          } else {
            navigate("/select-plan");
          }
        }, 500);
      } else {
        const err = await res.json();
        onError?.(err.message || "No se pudo iniciar sesión.");
      }
    } catch (error) {
      console.error((error as Error).message);
      onError?.("No se pudo conectar con el servidor.");
    } finally {
      SetLoading(false);
    }
  };

  // TODO: Implement
  const google_login = async () => {
    return false;
  };

  return (
    <Dialog open={open} onOpenChange={SetOpen}>
      <DialogTrigger asChild>
        <Button variant={"anim_round"} size="lg">
          Inicia sesión
        </Button>
      </DialogTrigger>
      <DialogContent>
        <div className="text-center">
          <h2 className="text-lg font-bold">Inicio de sesión</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Ingresa tus credenciales
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handle_login();
          }}
          className="space-y-4"
          noValidate
        >
          <div className="space-y-2 py-2">
            <Label htmlFor={`${id}-email`}>Correo electrónico</Label>
            <Input
              id={`${id}-email`}
              type="email"
              value={email}
              onChange={(e) => {
                SetEmail(e.target.value);
                SetValidationErrors((prev) => ({ ...prev, email: undefined }));
              }}
            />
            {validation_errors.email && (
              <p className="text-destructive mt-2 text-xs">
                {validation_errors.email}
              </p>
            )}
          </div>

          <div className="space-y-2 py-2">
            <Label htmlFor={`${id}-password`}>Contraseña</Label>
            <div className="relative">
              <Input
                id={`${id}-password`}
                type={showPassword ? "text" : "password"}
                className="pe-9"
                value={password}
                onChange={(e) => {
                  SetPassword(e.target.value);
                  SetValidationErrors((prev) => ({
                    ...prev,
                    password: undefined,
                  }));
                }}
              />
              <button
                type="button"
                onClick={() => SetShowPassword((prev) => !prev)}
                className="absolute inset-y-0 end-0 flex w-9 items-center justify-center text-muted-foreground/80 hover:text-foreground transition"
                aria-label={showPassword ? "Mostrar" : "Ocultar"}
              >
                {showPassword ? (
                  <EyeIcon size={16} />
                ) : (
                  <EyeOffIcon size={16} />
                )}
              </button>
            </div>
            {validation_errors.password && (
              <p className="text-destructive mt-2 text-xs">
                {validation_errors.password}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <LoaderCircleIcon
                  className="animate-spin"
                  size={16}
                  aria-hidden="true"
                />
                Iniciando sesión...
              </span>
            ) : (
              "Ingresar"
            )}
          </Button>
        </form>
        <div className="before:bg-border after:bg-border flex items-center gap-3 before:h-px before:flex-1 after:h-px after:flex-1">
          <span className="text-muted-foreground text-xs">o</span>
        </div>
        <Button type="button" variant="outline" onClick={google_login}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="0.98em"
            height="1em"
            viewBox="0 0 256 262"
          >
            <path
              fill="#4285f4"
              d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
            ></path>
            <path
              fill="#34a853"
              d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
            ></path>
            <path
              fill="#fbbc05"
              d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z"
            ></path>
            <path
              fill="#eb4335"
              d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
            ></path>
          </svg>
          <span>Ingresar con Google</span>
        </Button>
      </DialogContent>
    </Dialog>
  );
}
