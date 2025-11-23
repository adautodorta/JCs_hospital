import {LogOut} from "lucide-react";
import {useCallback, useEffect, useState} from "react";
import {toast} from "sonner";

import {Button} from "@/components/ui/button";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Spinner} from "@/components/ui/spinner";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {supabase} from "@/supabaseClient";

type Role = "patient" | "doctor" | "admin";
const ROLES: Role[] = ["patient", "doctor", "admin"];

interface Profile {
  id: string;
  email: string | null;
  name?: string | null;
  role?: string | null;
}

export const AdminDashboard: React.FC = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<Role | undefined>(undefined);

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState<Role>("patient");
  const [creating, setCreating] = useState(false);

  const loadProfiles = useCallback(async () => {
    try {
      setLoading(true);
      let query = supabase.from("PROFILES").select("*");

      if (roleFilter) {
        query = query.eq("role", roleFilter);
      }

      if (search.trim()) {
        const q = `%${search.trim()}%`;
        query = query.or(`name.ilike.${q},email.ilike.${q}`);
      }

      const {data, error} = await query.order("created_at", {ascending: false});

      if (error) {
        throw error;
      }

      setProfiles((data) as Profile[]);
    } catch (err: unknown) {
      console.error("loadProfiles error", err);
      const message = (err instanceof Error) ? err.message : "Erro ao carregar perfis";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [search, roleFilter]);

  useEffect(() => {
    void loadProfiles();
  }, [loadProfiles]);

  const normalizeRoleForSelect = (r?: string | null) => {
    if (!r) {
      return undefined;
    }
    return ROLES.includes(r as Role) ? (r as Role) : undefined;
  };

  const handleRoleChange = async (profileId: string, newRoleValue: string) => {
    if (!ROLES.includes(newRoleValue as Role)) {
      toast.error("Role inválida");
      return;
    }

    try {
      const {error} = await supabase
        .from("profiles")
        .update({role: newRoleValue})
        .eq("id", profileId);

      if (error) {
        throw error;
      }

      toast.success("Role atualizada");
      setProfiles(prev =>
        prev.map(p => (p.id === profileId ? {...p, role: newRoleValue} : p)),
      );
    } catch (err: unknown) {
      console.error("handleRoleChange error", err);
      const message = (err instanceof Error) ? err.message : "Erro ao atualizar role";
      toast.error(message);
    }
  };

  const handleCreateUser = async () => {
    if (!newEmail.trim()) {
      toast.error("Informe um email válido");
      return;
    }
    if (!newName.trim()) {
      toast.error("Informe um nome válido");
      return;
    }

    try {
      setCreating(true);

      const {error: createError} = await supabase.auth.admin.createUser({
        email: newEmail.trim(),
        email_confirm: false,
        user_metadata: {role: newRole, name: newName},
        password: "admin123",
      });

      if (createError) {
        throw createError;
      }

      toast.success("Usuário criado com sucesso");
      setCreateDialogOpen(false);
      setNewEmail("");
      setNewName("");
      setNewRole("patient");

      void loadProfiles();
    } catch (err: unknown) {
      console.error("handleCreateUser error", err);
      const message = (err instanceof Error) ? err.message : "Erro ao criar usuário";
      toast.error(message);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Área Admin</h1>

        <div className="flex flex-col items-end gap-3 lg:flex-row">
          <Button className="w-20" onClick={() => void loadProfiles()}>{loading ? (<Spinner />) : "Atualizar"}</Button>

          <Button
            onClick={() => {
              setCreateDialogOpen(true);
            }}
          >
            Criar usuário
          </Button>

          <Button className="cursor-pointer" variant="outline" size="sm" onClick={() => void supabase.auth.signOut()}>
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 items-center">
        <Input
          placeholder="Buscar por nome ou email..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
          className="w-full min-w-0"
        />

        <Select
          key={roleFilter ?? "empty"}
          value={roleFilter}
          onValueChange={(val: string) => {
            setRoleFilter(val as Role);
          }}
        >
          <SelectTrigger className="w-full min-w-0">
            <SelectValue placeholder="Filtrar por role (todos)" />
          </SelectTrigger>

          <SelectContent>
            {ROLES.map(r => (
              <SelectItem key={r} value={r}>
                {r}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          className="w-full"
          variant="outline"
          onClick={() => {
            setSearch("");
            setRoleFilter(undefined);
          }}
        >
          Limpar
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Criado em</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {profiles.length === 0
              ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      {loading ? "Carregando..." : "Nenhum perfil encontrado"}
                    </TableCell>
                  </TableRow>
                )
              : (
                  profiles.map((p) => {
                    const selectValue = normalizeRoleForSelect(p.role);
                    return (
                      <TableRow key={p.id}>
                        <TableCell>{p.name ?? "-"}</TableCell>
                        <TableCell>{p.email ?? "-"}</TableCell>

                        <TableCell>
                          <Select
                            value={selectValue}
                            onValueChange={(value) => {
                              void handleRoleChange(p.id, value);
                            }}
                          >
                            <SelectTrigger className="w-44">
                              <SelectValue placeholder="Sem role" />
                            </SelectTrigger>

                            <SelectContent>
                              {ROLES.map(r => (
                                <SelectItem key={r} value={r}>
                                  {r}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Criar novo usuário</DialogTitle>
          </DialogHeader>

          <div className="grid gap-3 py-2">
            <Input
              placeholder="Email do usuário"
              value={newEmail}
              onChange={(e) => {
                setNewEmail(e.target.value);
              }}
            />

            <Input
              placeholder="Nome completo do usuário"
              value={newName}
              onChange={(e) => {
                setNewName(e.target.value);
              }}
            />

            <Select
              value={newRole}
              onValueChange={(val: string) => {
                setNewRole(val as Role);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione a role" />
              </SelectTrigger>

              <SelectContent>
                {ROLES.map(r => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="flex gap-2">
            <Button
              variant="ghost"
              onClick={() => {
                setCreateDialogOpen(false);
              }}
            >
              Cancelar
            </Button>

            <Button
              onClick={() => {
                void handleCreateUser();
              }}
              disabled={creating}
            >
              {creating ? "Criando..." : "Criar usuário"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
