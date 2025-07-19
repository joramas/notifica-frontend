"use client";
import { MessageBox } from "@/components/MessageBox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowRight, BadgeCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const BACKEND_ORIGIN = import.meta.env.VITE_NOTIFICA_BACKEND_WEB_SERVICE_URL;

const plans = [
  {
    id: "STARTER",
    name: "Starter",
    price: 200,
    description: "Ideal para profesionales con pocas citas mensuales.",
    features: ["Hasta 160 citas/mes", "$1.25 MXN por cita"],
    cta: "Elegir Starter",
  },
  {
    id: "PROFESIONAL",
    name: "Profesional",
    price: 600,
    description: "Para negocios que manejan más volumen de clientes.",
    features: ["Hasta 600 citas/mes", "$1.00 MXN por cita"],
    cta: "Elegir Profesional",
    popular: true,
  },
  {
    id: "MAESTRO",
    name: "Maestro",
    price: 1400,
    description: "Máxima capacidad para negocios consolidadas.",
    features: ["Hasta 1,750 citas/mes", "$0.80 MXN por cita"],
    cta: "Elegir Maestro",
  },
];

const SelectPlan = () => {
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      maximumFractionDigits: 2,
    }).format(amount);

  const [access_token, SetAccessToken] = useState<string | null>(null);
  const [user_email, SetUserEmail] = useState<string | null>(null);
  const [message_box_open, SetMessageBoxOpen] = useState(false);
  const [selected_plan, SetSelectPlan] = useState<{
    id: string;
    name: string;
  } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (token) {
      SetAccessToken(token);

      // NOTE: Fetch the current user
      fetch(`${BACKEND_ORIGIN}/user/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          return res.ok ? res.json() : Promise.reject("Unauthorized");
        })
        .then((user) => {
          SetUserEmail(user.email);
        })
        .catch((err) => {
          console.error("Error fetching the user:", err);
        });
    }
  }, []);

  const get_checkout_url = async () => {
    if (!access_token) {
      toast.error("No estás autorizado para continuar.");
      return;
    }

    // NOTE: Just being cautious; this should never hit
    if (!selected_plan) {
      toast.error("InvalidCodePath");
      return;
    }

    try {
      const res = await fetch(`${BACKEND_ORIGIN}/payment/checkout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          selectedPlan: selected_plan.id,
          userEmail: user_email,
        }),
      });

      if (!res.ok) {
        toast.error("Stripe no pudo crear una sesión válida", {
          description: "Por favor, espera uno momentos y vuelve a intentarlo.",
        });
        return;
      }

      // NOTE: payment/checkout returns a session.url
      const checkout_url = await res.text();
      window.location.href = checkout_url;
    } catch (error) {
      console.error("Error getting Stripe checkout URL:", error);
      toast.error("Error al redirigir a Stripe.");
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex flex-col gap-16 px-8 py-16 text-center flex-grow">
        <div className="text-left">
          <h1 className="text-3xl font-bold">Notifica</h1>
        </div>

        <div className="flex flex-col items-center justify-center gap-8">
          <h2 className="mb-0 text-balance font-medium text-5xl tracking-tighter!">
            Elige tu plan
          </h2>
          <p className="mx-auto mt-0 mb-0 max-w-2xl text-balance text-lg text-muted-foreground">
            Planes claros y sin sorpresas. Paga mes a mes según tus necesidades.
            Cancela cuando quieras.
          </p>

          <div className="mt-8 grid w-full max-w-4xl gap-4 lg:grid-cols-3">
            {plans.map((plan) => (
              <Card
                className={cn(
                  "relative w-full text-left",
                  plan.popular && "ring-2 ring-primary",
                )}
                key={plan.id}
              >
                {plan.popular && (
                  <Badge className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full">
                    Más Solicitado
                  </Badge>
                )}
                <CardHeader>
                  <CardTitle className="font-medium text-xl">
                    {plan.name}
                  </CardTitle>
                  <CardDescription>
                    <p>{plan.description}</p>
                    <span className="font-medium text-foreground">
                      {formatCurrency(plan.price)} / mes
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-2">
                  {plan.features.map((feature, index) => (
                    <div
                      className="flex items-center gap-2 text-muted-foreground text-sm"
                      key={index}
                    >
                      <BadgeCheck className="h-4 w-4" />
                      {feature}
                    </div>
                  ))}
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    variant={plan.popular ? "default" : "secondary"}
                    onClick={() => {
                      SetSelectPlan({ id: plan.id, name: plan.name });
                      SetMessageBoxOpen(true);
                    }}
                  >
                    {plan.cta}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  {selected_plan && (
                    <MessageBox
                      open={message_box_open}
                      setOpen={SetMessageBoxOpen}
                      title={`Plan ${selected_plan?.name}`}
                      description="Serás redireccionado a Stripe para proceder al pago."
                      confirmLabel="Ok"
                      onConfirm={get_checkout_url}
                    />
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <footer className="py-4 text-sm text-muted-foreground text-center">
        <p>©2025 ORVITech</p>
      </footer>
    </div>
  );
};

export default SelectPlan;
