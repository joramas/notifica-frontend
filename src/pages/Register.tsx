import { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Plan = {
  id: string;
  name: string;
  price: string;
  messageLimit: string;
  costPerMessage: string;
};

const plans: Plan[] = [
  {
    id: "STARTER",
    name: "Notifica STARTER",
    price: "$200.00/mes",
    messageLimit: "160",
    costPerMessage: "$1.25 pesos por cita",
  },
  {
    id: "PROFESIONAL",
    name: "Notifica PROFESIONAL",
    price: "$600.00/mes",
    messageLimit: "600",
    costPerMessage: "$1.00 pesos por cita",
  },
  {
    id: "MAESTRO",
    name: "Notifica MAESTRO",
    price: "$1,400.00/mes",
    messageLimit: "1,750",
    costPerMessage: "$0.80 pesos por cita",
  },
];

const BACKEND_URL = import.meta.env.VITE_NOTIFICA_BACKEND_WEB_SERVICE_URL;

export default function RegisterPage() {
  const [email, SetEmail] = useState("");
  const [password, SetPassword] = useState("");
  const [plan, SetPlan] = useState("STARTER");

  const handle_register = async () => {
    const res = await fetch(`${BACKEND_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, plan }),
    });

    if (!res.ok) {
      const err = await res.json();
      toast.error(err.message || "El regitro no se pudo completar");
      return;
    }

    const data = await res.json();
    if (data?.url) {
      // NOTE: Redirect to Stripe
      window.location.href = data.url;
    } else {
      toast.error("El registro falló.");
    }
  };

  // NOTE: Create the plan cards
  const cards = [];
  for (let i = 0; i < plans.length; ++i) {
    const p = plans[i];
    cards.push(
      <Card
        key={p.id}
        onClick={() => {
          SetPlan(p.id);
        }}
        className={cn(
          "cursor-pointer border-2 transition-all",
          plan === p.id
            ? "bg-secondary border-primary shadow-md"
            : "border-muted",
        )}
      >
        <CardHeader>
          <CardTitle className="text-lg">{p.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 text-sm text-muted-foreground">
          <p>{p.price}</p>
          <p>{p.messageLimit} citas por mes</p>
          <p>{p.costPerMessage}</p>
        </CardContent>
      </Card>,
    );
  }

  // TODO: THIS PAGE IS COMPLETELY WRONG!!! AQUI ME QUEDE!

  return (
    <div className="max-w-4xl mx-auto mt-10 space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold">Crea tu cuenta</h2>
        <p className="text-sm text-muted-foreground">
          Escoge el plan que mejor te acomode y procede al pago
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="correo@ejemplo.com"
            value={email}
            onChange={(e) => SetEmail(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => SetPassword(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cards}
        </div>

        <Button className="w-full" onClick={handle_register}>
          Proceder al pago
        </Button>
      </div>
    </div>
  );
}
