import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, Mail, Phone, Globe, Building2, MapPin, ChevronDown, ChevronUp } from "lucide-react";
import type { User as UserType } from "@/types/user";

/**
 * Card de utilizador
 * 
 * Props:
 * - user: dados do utilizador
 * 
 * Funcionalidades:
 * - Mostra info básica sempre visível (nome, username, email)
 * - Em desktop: hover mostra info extra
 * - Em mobile: botão "Ver mais" para expandir
 * - Click no card navega para detalhe
 * - Focável e navegável por teclado (Enter abre detalhe)
 */
interface UserCardProps {
  user: UserType;
}

export const UserCard = ({ user }: UserCardProps) => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);

  // Navegar para detalhe do utilizador
  const handleClick = () => {
    navigate(`/users/${user.id}`);
  };

  // Handler para teclado (Enter)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleClick();
    }
  };

  // Toggle expansão em mobile
  const toggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevenir navegação ao clicar no botão
    setIsExpanded(!isExpanded);
  };

  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className="group cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.01] focus:ring-2 focus:ring-primary focus:outline-none"
      aria-label={`Ver detalhes de ${user.name}`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg truncate">{user.name}</h3>
            <p className="text-sm text-muted-foreground">@{user.username}</p>
          </div>
          <Badge variant="secondary" className="shrink-0">
            <User className="h-3 w-3" />
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Info básica - sempre visível */}
        <div className="flex items-center gap-2 text-sm">
          <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
          <span className="truncate">{user.email}</span>
        </div>

        {/* Info extra - visível em hover (desktop) ou ao expandir (mobile) */}
        <div
          className={`space-y-2 md:opacity-0 md:max-h-0 md:group-hover:opacity-100 md:group-hover:max-h-96 transition-all duration-200 ${
            isExpanded ? "opacity-100 max-h-96" : "opacity-0 max-h-0"
          } overflow-hidden`}
        >
          <div className="flex items-center gap-2 text-sm">
            <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="truncate">{user.phone}</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Globe className="h-4 w-4 text-muted-foreground shrink-0" />
            <a
              href={`https://${user.website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline truncate"
              onClick={(e) => e.stopPropagation()}
            >
              {user.website}
            </a>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Building2 className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="truncate">{user.company.name}</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="truncate">{user.address.city}</span>
          </div>
        </div>

        {/* Botão "Ver mais" apenas em mobile */}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleExpand}
          className="w-full md:hidden mt-2"
          aria-expanded={isExpanded}
        >
          {isExpanded ? (
            <>
              Ver menos <ChevronUp className="ml-2 h-4 w-4" />
            </>
          ) : (
            <>
              Ver mais <ChevronDown className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
