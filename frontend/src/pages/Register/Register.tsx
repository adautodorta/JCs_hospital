import {useMutation} from "@tanstack/react-query";
import {InfoIcon} from "lucide-react";
import {useState} from "react";
import {useNavigate, Link} from "react-router";
import {toast} from "sonner";

import LogoHospital from "./../../assets/LOGO JCS.webp";

import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Spinner} from "@/components/ui/spinner";
import {Switch} from "@/components/ui/switch";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import {supabase} from "@/supabaseClient";
import {formatCPF} from "@/utils/functions";
import routes from "@/utils/routes";

export function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [fullName, setFullName] = useState("");
  const [cpf, setCPF] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [momFullName, setMomFullName] = useState("");
  const [address, setAddress] = useState("");
  const [nationality, setNationality] = useState("");
  const [isPriority, setIsPriority] = useState(false);

  const navigate = useNavigate();

  const {
    mutate: registerMutate,
    isPending: isRegisterPending,
  } = useMutation({
    mutationFn: async (data: {
      email: string;
      password: string;
      fullName: string;
      cpf: string;
      dateOfBirth: string;
      gender: string;
      momFullName: string;
      address: string;
      nationality: string;
      isPriority: boolean;
    }) => {
      const {data: signUpData, error: signUpError} = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });

      if (signUpError) {
        throw new Error(signUpError.message);
      }
      if (!signUpData.user) {
        throw new Error("Usuário não retornado.");
      }

      const userId = signUpData.user.id;

      const {error: profileError} = await supabase.from("PROFILES").insert({
        id: userId,
        full_name: data.fullName,
        document_number: data.cpf,
        date_of_birth: data.dateOfBirth,
        gender: data.gender,
        mom_full_name: data.momFullName,
        address: data.address,
        nationality: data.nationality,
        priority: data.isPriority,
        role: "patient",
      });

      if (profileError) {
        console.error(profileError);
        throw new Error(profileError.message);
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
      fullName,
      cpf,
      dateOfBirth,
      gender,
      momFullName,
      address,
      nationality,
      isPriority,
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
            <Label htmlFor="fullName">Nome completo</Label>
            <Input
              id="fullName"
              placeholder="Insira seu nome completo"
              value={fullName}
              required
              onChange={(e) => {
                setFullName(e.target.value);
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
            <Label htmlFor="dateOfBirth">Data de nascimento</Label>
            <Input
              id="dateOfBirth"
              type="date"
              value={dateOfBirth}
              required
              onChange={(e) => {
                setDateOfBirth(e.target.value);
              }}
              disabled={isRegisterPending}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="gender">Gênero</Label>
            <Select
              onValueChange={setGender}
              value={gender}
              disabled={isRegisterPending}
              required
            >
              <SelectTrigger id="gender">
                <SelectValue placeholder="Selecione o gênero" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="M">Masculino</SelectItem>
                <SelectItem value="F">Feminino</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="momFullName">Nome completo da Mãe</Label>
            <Input
              id="momFullName"
              placeholder="Insira o nome completo da mãe"
              value={momFullName}
              required
              onChange={(e) => {
                setMomFullName(e.target.value);
              }}
              disabled={isRegisterPending}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="address">Endereço</Label>
            <Input
              id="address"
              placeholder="Rua, número, bairro, cidade, estado."
              value={address}
              required
              onChange={(e) => {
                setAddress(e.target.value);
              }}
              disabled={isRegisterPending}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="nationality">Nacionalidade</Label>
            <Input
              id="nationality"
              placeholder="Ex: Brasileira"
              value={nationality}
              required
              onChange={(e) => {
                setNationality(e.target.value);
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

          <div className="flex items-center justify-between mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border">
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <Label htmlFor="isPriority" className="font-semibold text-base">
                  Atendimento Prioritário
                </Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <InfoIcon className="w-4 h-4 text-primary cursor-pointer" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs text-sm">
                    <p className="font-bold mb-1">Requisitos de Prioridade (Lei nº 10.048/2000):</p>
                    <ul className="list-disc list-inside space-y-0.5">
                      <li>Pessoas com idade igual ou superior a **60 (sessenta) anos**.</li>
                      <li>Pessoas com **deficiência**.</li>
                      <li>**Gestantes**.</li>
                      <li>**Lactantes** (amamentando).</li>
                      <li>Pessoas com crianças de colo.</li>
                      <li>Pessoas com **TEA** (Transtorno do Espectro Autista).</li>
                    </ul>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Ao ativar, você confirma se enquadrar em um dos requisitos acima.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <p className="text-xs text-muted-foreground">
                Ative se você se enquadra nos requisitos legais.
              </p>
            </div>
            <Switch
              id="isPriority"
              checked={isPriority}
              onCheckedChange={setIsPriority}
              disabled={isRegisterPending}
              aria-label="Atendimento Prioritário"
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
