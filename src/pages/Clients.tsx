import { useEffect, useState } from "react";
import type { Customer } from "@/lib/model_types";
import { FetchCustomers, CreateCustomer } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

// TODO: For testing purposes only!
const TEST_USER_ID: string = "7002ea91-d590-4615-8238-988c2720d72e";

export default function ClientsPage() {
  const [customers, SetCustomers] = useState<Customer[] | null>(null);
  const [loading, SetLoading] = useState(true);
  const [filter, SetFilter] = useState("");
  const [show_add_modal, SetShowAddModal] = useState(false);
  const [form, SetForm] = useState({ name: "", phone: "", email: "" });

  // NOTE: Fetching
  useEffect(() => {
    FetchCustomers(TEST_USER_ID)
      .then(SetCustomers)
      .catch((error) => {
        console.error("Error loading customers", error);
        SetCustomers([]);
      })
      .finally(() => SetLoading(false));
  }, []);

  // NOTE: Agregar Cliente submit
  const handle_submit = async () => {
    const trimmed_name = form.name.trim();
    const trimmed_phone = form.phone.trim();
    const trimmed_email = form.email.trim();

    if (trimmed_name === "") {
      toast.error("El nombre es obligatorio.");
      return;
    }

    if (trimmed_phone === "") {
      toast.error("El teléfono es obligatorio.");
      return;
    }

    const phone_valid = /^[\d+\-\s]+$/.test(trimmed_phone);
    if (!phone_valid) {
      toast.error("El teléfono contiene caracteres inválidos.");
      return;
    }

    if (trimmed_email.length) {
      const email_valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed_email);
      if (!email_valid) {
        toast.error("El correo electrónico no es válido.");
        return;
      }
    }

    try {
      const new_customer = await CreateCustomer({
        userId: TEST_USER_ID,
        name: trimmed_name,
        phone: trimmed_phone,
        email: trimmed_email.length ? trimmed_email : undefined,
      });
      SetCustomers((prev: Customer[] | null): Customer[] => {
        if (prev) {
          return [new_customer, ...prev];
        } else {
          return [new_customer];
        }
      });
      SetShowAddModal(false);
      SetForm({ name: "", phone: "", email: "" });
      toast.success("Cliente agregado correctamente.");
    } catch (error) {
      console.error("Failed to create a customer", error);
      toast.error("No se pudo agregar al cliente.");
      SetShowAddModal(false);
    }
  };

  // NOTE: Page contents
  let page_content = null;
  let modal_content = null;

  if (!loading) {
    if (customers) {
      if (customers.length > 0) {
        // NOTE: Render the customers

        const cards = [];
        for (let i = 0; i < customers.length; ++i) {
          const customer = customers[i];
          if (
            !filter.length ||
            customer.name.toLowerCase().includes(filter.toLowerCase())
          ) {
            cards.push(
              <Card key={customer.id}>
                <CardContent className="p-4">
                  <p className="font-medium text-lg">{customer.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {customer.phone}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {customer.email}
                  </p>
                </CardContent>
              </Card>,
            );
          }
        }

        if (cards.length) {
          page_content = <div className="grid gap-4">{cards}</div>;
        } else {
          page_content = (
            <p className="text-muted">
              No se encontraron clientes con el nombre {`${filter}`}
            </p>
          );
        }
      } else {
        // NOTE: No customers, inform in a paragraph
        page_content = (
          <p className="text-muted">No hay clientes registrados</p>
        );
      }
    }
  } else {
    // NOTE: Loading path (using skeletons; might change to loading icon)
    const skeletons = [];
    for (let i = 0; i < 3; ++i) {
      skeletons.push(<Skeleton key={i} className="h-16 w-full" />);
    }

    page_content = <div className="space-y-2">{skeletons}</div>;
  }

  // NOTE: New customer modal form
  if (show_add_modal) {
    modal_content = (
      <div className="fixed inset-0 bg-primary/30 flex items-center justify-center z-50">
        <div className="bg-secondary p-6 rounded-xl shadow-md w-full max-w-md space-y-4">
          <h2 className="text-xl font-bold">Nuevo Cliente</h2>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Nombre"
              value={form.name}
              onChange={(e) => SetForm({ ...form, name: e.target.value })}
            />
            <label className="text-red-600">
              {form.name.length ? "" : "*"}
            </label>
          </div>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Telefóno"
              value={form.phone}
              onChange={(e) => SetForm({ ...form, phone: e.target.value })}
            />
            <label className="text-red-600">
              {form.phone.length ? "" : "*"}
            </label>
          </div>
          <Input
            placeholder="Correo Electrónico"
            value={form.email}
            onChange={(e) => SetForm({ ...form, email: e.target.value })}
          />
          <div className="flex justify-end gap-2">
            <Button
              variant="destructive"
              onClick={() => SetShowAddModal(false)}
            >
              Cancelar
            </Button>
            <Button onClick={handle_submit}>Guardar</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Clientes</h2>
        <Button onClick={() => SetShowAddModal(true)}>Agregar Cliente</Button>
      </div>
      <div className="p-6 space-y-2">
        <Input
          type="text"
          placeholder="Buscar por nombre:"
          value={filter}
          onChange={(e) => SetFilter(e.target.value)}
          className="max-w-xs"
        />
      </div>
      {page_content}
      {modal_content}
    </div>
  );
}
