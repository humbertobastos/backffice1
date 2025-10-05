import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  Mail,
  Phone,
  Globe,
  Building2,
  MapPin,
  FileText,
  AlertCircle,
} from "lucide-react";
import type { User, Post } from "@/types/user";

/**
 * Página de detalhe do utilizador
 * 
 * Funcionalidades:
 * - Fetch do utilizador e dos seus posts
 * - Header card com info completa do utilizador
 * - Lista de posts com badge de contagem
 * - Botão "Voltar" que mantém state da lista (React Router cuida disso)
 * - Estados: loading, erro user, erro posts
 */
const UserDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  /**
   * Fetch do utilizador
   */
  const {
    data: user,
    isLoading: isLoadingUser,
    isError: isErrorUser,
    error: errorUser,
  } = useQuery<User>({
    queryKey: ["user", id],
    queryFn: async () => {
      const response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
      if (!response.ok) {
        throw new Error("Erro ao carregar utilizador");
      }
      return response.json();
    },
    enabled: !!id, // Só faz fetch se houver id
  });

  /**
   * Fetch dos posts do utilizador
   */
  const {
    data: posts = [],
    isLoading: isLoadingPosts,
    isError: isErrorPosts,
  } = useQuery<Post[]>({
    queryKey: ["posts", id],
    queryFn: async () => {
      const response = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${id}`);
      if (!response.ok) {
        throw new Error("Erro ao carregar posts");
      }
      return response.json();
    },
    enabled: !!id && !!user, // Só faz fetch se houver id e user
  });

  // Truncar texto com limite de caracteres
  const truncateText = (text: string, limit: number = 140) => {
    if (text.length <= limit) return text;
    return text.substring(0, limit) + "...";
  };

  // Handler do botão "Voltar"
  const handleBack = () => {
    navigate("/users");
  };

  // Estado de loading do utilizador
  if (isLoadingUser) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <Skeleton className="h-10 w-24" />
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Estado de erro do utilizador
  if (isErrorUser || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
          <h2 className="text-xl font-semibold">⚠️ Ocorreu um erro</h2>
          <p className="text-muted-foreground">
            {errorUser instanceof Error ? errorUser.message : "Tenta novamente."}
          </p>
          <Button onClick={handleBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
        {/* Botão Voltar */}
        <Button variant="ghost" onClick={handleBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>

        {/* Card com info do utilizador */}
        <Card className="shadow-md">
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle className="text-2xl mb-1">{user.name}</CardTitle>
                <p className="text-muted-foreground">@{user.username}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Contactos */}
            <div className="grid md:grid-cols-2 gap-3">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                <a href={`mailto:${user.email}`} className="text-primary hover:underline">
                  {user.email}
                </a>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                <span>{user.phone}</span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Globe className="h-4 w-4 text-muted-foreground shrink-0" />
                <a
                  href={`https://${user.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {user.website}
                </a>
              </div>
            </div>

            {/* Empresa */}
            <div className="pt-4 border-t">
              <div className="flex items-start gap-2 mb-1">
                <Building2 className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">{user.company.name}</p>
                  <p className="text-sm text-muted-foreground italic">{user.company.catchPhrase}</p>
                </div>
              </div>
            </div>

            {/* Endereço */}
            <div className="pt-4 border-t">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p>
                    {user.address.street}, {user.address.suite}
                  </p>
                  <p>{user.address.city}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card de Posts */}
        <Card className="shadow-md">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <CardTitle>Posts</CardTitle>
              </div>
              {!isLoadingPosts && !isErrorPosts && (
                <Badge variant="secondary">{posts.length}</Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {/* Loading de posts */}
            {isLoadingPosts && (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ))}
              </div>
            )}

            {/* Erro ao carregar posts */}
            {isErrorPosts && (
              <p className="text-muted-foreground text-center py-4">
                Sem posts para este utilizador
              </p>
            )}

            {/* Lista de posts */}
            {!isLoadingPosts && !isErrorPosts && posts.length === 0 && (
              <p className="text-muted-foreground text-center py-4">
                Sem posts para este utilizador
              </p>
            )}

            {!isLoadingPosts && !isErrorPosts && posts.length > 0 && (
              <div className="space-y-4">
                {posts.map((post) => (
                  <div
                    key={post.id}
                    className="p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <h4 className="font-medium mb-2 capitalize">{post.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {truncateText(post.body)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserDetail;
