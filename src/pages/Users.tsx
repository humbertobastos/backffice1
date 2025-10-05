import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { UserCard } from "@/components/UserCard";
import { UserCardSkeleton } from "@/components/UserCardSkeleton";
import { useDebounce } from "@/hooks/useDebounce";
import { Search, ArrowUpDown, AlertCircle, Users as UsersIcon } from "lucide-react";
import type { User } from "@/types/user";

/**
 * Página de lista de utilizadores
 * 
 * Funcionalidades:
 * - Fetch de dados da API JSONPlaceholder com cache (React Query)
 * - Pesquisa por nome ou email (debounced)
 * - Filtros por cidade e empresa
 * - Ordenação por nome (A-Z / Z-A)
 * - Contador de resultados
 * - Grid responsivo (1 col mobile, 2-3 desktop)
 * - Estados: loading, erro, vazio
 */
const Users = () => {
  // State para pesquisa e filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [cityFilter, setCityFilter] = useState<string>("all");
  const [companyFilter, setCompanyFilter] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Debounce na pesquisa (250ms)
  const debouncedSearch = useDebounce(searchTerm, 250);

  /**
   * Fetch dos utilizadores com React Query
   * Benefícios:
   * - Cache automático em memória
   * - Retry automático em caso de erro
   * - Estados de loading e erro geridos automaticamente
   */
  const {
    data: users = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await fetch("https://jsonplaceholder.typicode.com/users");
      if (!response.ok) {
        throw new Error("Erro ao carregar utilizadores");
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // Cache válido por 5 minutos
  });

  /**
   * Extrair valores únicos para os filtros
   * Cidades e empresas são geradas a partir dos dados dos utilizadores
   */
  const cities = useMemo(() => {
    const uniqueCities = [...new Set(users.map((u) => u.address.city))];
    return uniqueCities.sort();
  }, [users]);

  const companies = useMemo(() => {
    const uniqueCompanies = [...new Set(users.map((u) => u.company.name))];
    return uniqueCompanies.sort();
  }, [users]);

  /**
   * Filtrar e ordenar utilizadores
   * 1. Pesquisa por nome ou email (case-insensitive)
   * 2. Filtro por cidade
   * 3. Filtro por empresa
   * 4. Ordenação por nome
   */
  const filteredUsers = useMemo(() => {
    let filtered = [...users];

    // Pesquisa
    if (debouncedSearch) {
      const searchLower = debouncedSearch.toLowerCase();
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(searchLower) ||
          user.email.toLowerCase().includes(searchLower)
      );
    }

    // Filtro por cidade
    if (cityFilter !== "all") {
      filtered = filtered.filter((user) => user.address.city === cityFilter);
    }

    // Filtro por empresa
    if (companyFilter !== "all") {
      filtered = filtered.filter((user) => user.company.name === companyFilter);
    }

    // Ordenação
    filtered.sort((a, b) => {
      const comparison = a.name.localeCompare(b.name, "pt");
      return sortOrder === "asc" ? comparison : -comparison;
    });

    return filtered;
  }, [users, debouncedSearch, cityFilter, companyFilter, sortOrder]);

  // Toggle ordenação
  const toggleSort = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  // Estado de loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-48" />
          </div>
          <Skeleton className="h-16 w-full" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <UserCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Estado de erro
  if (isError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
          <h2 className="text-xl font-semibold">⚠️ Ocorreu um erro</h2>
          <p className="text-muted-foreground">
            {error instanceof Error ? error.message : "Tenta novamente."}
          </p>
          <Button onClick={() => refetch()}>Tentar novamente</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <UsersIcon className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">Utilizadores</h1>
        </div>

        {/* Toolbar */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Pesquisa */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Pesquisar por nome ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
                aria-label="Pesquisar utilizadores"
              />
            </div>

            {/* Filtro por Cidade */}
            <Select value={cityFilter} onValueChange={setCityFilter}>
              <SelectTrigger className="w-full md:w-48" aria-label="Filtrar por cidade">
                <SelectValue placeholder="Cidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as cidades</SelectItem>
                {cities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Filtro por Empresa */}
            <Select value={companyFilter} onValueChange={setCompanyFilter}>
              <SelectTrigger className="w-full md:w-48" aria-label="Filtrar por empresa">
                <SelectValue placeholder="Empresa" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as empresas</SelectItem>
                {companies.map((company) => (
                  <SelectItem key={company} value={company}>
                    {company}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Botão de ordenação */}
            <Button
              variant="outline"
              onClick={toggleSort}
              className="shrink-0"
              aria-label={`Ordenar por nome ${sortOrder === "asc" ? "Z-A" : "A-Z"}`}
            >
              <ArrowUpDown className="h-4 w-4 mr-2" />
              {sortOrder === "asc" ? "A-Z" : "Z-A"}
            </Button>
          </div>

          {/* Contador de resultados */}
          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              {filteredUsers.length} {filteredUsers.length === 1 ? "resultado" : "resultados"}
            </Badge>
          </div>
        </div>

        {/* Grid de utilizadores */}
        {filteredUsers.length === 0 ? (
          // Estado vazio
          <div className="text-center py-12">
            <UsersIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg text-muted-foreground">Sem resultados.</p>
          </div>
        ) : (
          // Grid de cards
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredUsers.map((user) => (
              <UserCard key={user.id} user={user} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Import do Skeleton para usar no loading
import { Skeleton } from "@/components/ui/skeleton";

export default Users;
