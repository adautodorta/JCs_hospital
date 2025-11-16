import {useMutation} from "@tanstack/react-query";
import {useState} from "react";
import {Link, useNavigate} from "react-router";
import {toast} from "sonner";

import LogoHospital from "./../../assets/LOGO JCS.webp";

import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Spinner} from "@/components/ui/spinner";
import {supabase} from "@/supabaseClient";
import routes from "@/utils/routes";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const {
    mutate: loginMutate,
    isPending: isLoginPending,
  } = useMutation({
    mutationFn: async (data: {email: string; password: string}) => {
      const {data: session, error} = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        throw new Error(error.message);
      }

      return session;
    },

    onSuccess: () => {
      toast.success("Login efetuado com sucesso!");
      void navigate(routes.DASHBOARD);
    },

    onError: (err) => {
      if (err.message === "Invalid login credentials") {
        toast.error("O email ou senha informados estão incorretos");
      } else {
        toast.error(err.message);
      }
    },
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutate({email, password});
  };

  return (
    <div className="px-6 w-full flex justify-center mt-16">
      <div className="w-full max-w-[427px] flex flex-col items-center">

        <img
          className="mb-10 w-36"
          src={LogoHospital}
        />

        <div className="w-full justify-center">
          <h2 className="w-full flex justify-center mb-6">
            <span className="text-xl max-w-56 text-center font-bold lg:text-2xl lg:max-w-full">
              Login
            </span>
          </h2>

          <form
            onSubmit={(e) => {
              handleLogin(e);
            }}
            className="flex flex-col w-full"
          >
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Preencha seu email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                />
              </div>
              <div className="grid gap-2 mb-5">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  placeholder="Preencha sua senha"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />
              </div>
              <Button type="submit" disabled={isLoginPending} className="w-full cursor-pointer">
                {isLoginPending ? <Spinner /> : "Entrar"}
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                Não tem conta?
                {" "}
                <Link to={routes.REGISTER} className="text-primary hover:underline">
                  Criar conta
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
