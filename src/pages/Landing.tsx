"use client";

import { RegisterDialog } from "@/components/RegisterDialog";
import Lottie from "lottie-react";
import whatsapp_anim from "@/assets/whatsapp.json";
import { useEffect } from "react";
import { toast } from "sonner";
import { LoginDialog } from "@/components/LoginDialog";

export default function LandingPage() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("verified") === "true") {
      toast.success("Tu correo ha sido verificado exitosamente", {
        description: "Ingresa a tu cuenta",
        duration: 5000,
      });
    } else if (params.get("expired") === "true") {
      toast.error("El link de tu correo ya no es válido.", {
        description: "En Configuración puedes solictar uno nuevo.",
        duration: 5000,
      });
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-between px-6 text-center">
      <main className="flex flex-1 items-center justify-center">
        <div className="max-w-2xl space-y-6">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Notifica
          </h1>
          <h2 className="flex items-center justify-center gap-2 text-2xl font-semibold text-secondary-foreground">
            Recordatorios automáticos por WhatsApp
            <div className="w-8 h-8">
              <Lottie animationData={whatsapp_anim} autoplay />
            </div>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto">
            Reduce ausencias, ahorra tiempo y brinda una experiencia
            profesional. <br />
            Notifica se encarga de todo — ¡tus clientes no volverán a olvidar
            una cita!
          </p>
        </div>

        <div className="space-y-3">
          <LoginDialog
            onSuccess={(msg) => {
              toast.success(msg);
            }}
            onError={(msg) => {
              toast.error(msg);
            }}
          />
          <p className="text-sm text-muted-foreground">
            ¿No tienes cuenta?{" "}
            <RegisterDialog
              onSuccess={(msg, email) =>
                toast.warning(msg, {
                  description: email,
                  duration: 5000,
                })
              }
              onError={(msg) => toast.error(msg)}
            />
          </p>
        </div>
      </main>

      <footer className="py-4 text-sm text-muted-foreground">
        <p>©2025 ORVITech</p>
      </footer>
    </div>
  );
}
