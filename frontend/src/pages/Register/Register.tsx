import {useMutation} from "@tanstack/react-query";
import {useState} from "react";
import {useNavigate, Link} from "react-router";
import {toast} from "sonner";

import LogoHospital from "./../../assets/LOGO JCS.webp";

import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Spinner} from "@/components/ui/spinner";
import {supabase} from "@/supabaseClient";
import {formatCPF} from "@/utils/functions";
import routes from "@/utils/routes";

export function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [cpf, setCPF] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const navigate = useNavigate();

  const {
    mutate: registerMutate,
    isPending: isRegisterPending,
  } = useMutation({
    mutationFn: async (data: {
      email: string;
      password: string;
      name: string;
      cpf: string;
      birth_date: string;
    }) => {
      const {data: signUpData, error: signUpError}
        = await supabase.auth.signUp({
          email: data.email,
          password: data.password,
          options: {
            data: {
              name: data.name,
              role: "patient",
            },
          },
        });

      if (signUpError) {
        throw new Error(signUpError.message);
      }
      if (!signUpData.user) {
        throw new Error("Usuário não retornado.");
      }

      const userId = signUpData.user.id;

      const {error: patientError} = await supabase
        .from("patients")
        .insert({
          id: crypto.randomUUID(),
          user_id: userId,
          cpf: data.cpf,
          date_of_birth: data.birth_date,
          number_phone: "",
        });

      if (patientError) {
        console.error(patientError);
        throw new Error(patientError.message);
      }

      return true;
    },

    onSuccess: () => {
      toast.success("Cadastro realizado com sucesso!");
      void navigate(routes.LOGIN);
    },

    onError: (err) => {
      toast.error(err.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    registerMutate({
      email,
      password,
      name,
      cpf,
      birth_date: birthDate,
    });
  };

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, "");

    const limitedDigits = digits.slice(0, 11);

    setCPF(limitedDigits);
  };

  return (
    <div className="px-6 w-full flex justify-center mt-16">
      <div className="w-full max-w-[427px] flex flex-col items-center">

        <img className="mb-10 w-36" src={LogoHospital} />

        <h2 className="text-xl font-bold mb-6 text-center">Criar Conta</h2>

        <form onSubmit={handleSubmit} className="flex flex-col w-full gap-4">

          <div className="grid gap-2">
            <Label htmlFor="name">Nome completo</Label>
            <Input
              id="name"
              placeholder="Insira seu nome completo"
              value={name}
              required
              onChange={(e) => {
                setName(e.target.value);
              }}
              disabled={isRegisterPending}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="cpf">CPF</Label>
            <Input
              id="cpf"
              placeholder="Insira seu CPF"
              value={formatCPF(cpf)}
              required
              onChange={handleCpfChange}
              disabled={isRegisterPending}
              maxLength={14}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="birthDate">Data de nascimento</Label>
            <Input
              id="birthDate"
              type="date"
              value={birthDate}
              required
              onChange={(e) => {
                setBirthDate(e.target.value);
              }}
              disabled={isRegisterPending}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              placeholder="Insira o seu email"
              type="email"
              value={email}
              required
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              disabled={isRegisterPending}
            />
          </div>

          <div className="grid gap-2 mb-5">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              placeholder="Insira uma senha"
              type="password"
              value={password}
              required
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              disabled={isRegisterPending}
            />
          </div>

          <Button
            type="submit"
            disabled={isRegisterPending}
            className="w-full"
          >
            {isRegisterPending ? <Spinner /> : "Registrar"}
          </Button>

          <p className="text-center text-sm text-muted-foreground mb-12">
            Já tem conta?
            <Link to={routes.LOGIN} className="text-primary hover:underline ml-1">
              Fazer login
            </Link>
          </p>

        </form>
      </div>
    </div>
  );
}
