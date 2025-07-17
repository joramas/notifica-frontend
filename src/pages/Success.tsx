import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/context/auth";
import { toast } from "sonner";

export default function SuccessPage() {
  const [search_params] = useSearchParams();
  const session_id = search_params.get("session_id");
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!session_id) {
      return;
    }

    const confirm = async () => {
      try {
        const res = await fetch(`api/auth/confirm?session_id=${session_id}`);
        const data = await res.json();

        if (data.token) {
          login(data.token);
          navigate("/dashboard");
        } else {
          toast.error("No pudimos comprobar tu suscripción");
        }
      } catch (error) {
        console.error(error);
        toast.error("Algo salió mal");
      }
    };

    confirm();
  }, [session_id, login, navigate]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-muted-foreground text-sm">
        Confirmando tu suscripción...
      </p>
    </div>
  );
}
