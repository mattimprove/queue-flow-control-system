
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Bell, Settings, LogOut, Trophy } from "lucide-react";
import { Link } from "react-router-dom";

interface MainHeaderProps {
  title: string;
  pendingAlerts: number;
}

const MainHeader = ({ title, pendingAlerts = 0 }: MainHeaderProps) => {
  const { logout, isAuthenticated, user } = useAuth();

  return (
    <header className="bg-card p-4 border-b border-border sticky top-0 z-10">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-6">
          <img 
            src="/lovable-uploads/4c7404d8-ef38-4ae1-b736-66ac06729fc0.png" 
            alt="Sling Logo" 
            className="h-14 w-auto transition-all hover:scale-110 hover:drop-shadow-md" 
          />
          <h1 className="text-2xl font-bold text-primary">{title}</h1>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/performance">
            <Button variant="ghost" size="icon" title="Desempenho">
              <Trophy className="h-5 w-5 text-amber-500" />
            </Button>
          </Link>

          {pendingAlerts > 0 && (
            <div className="relative">
              <Bell className="h-5 w-5 text-primary animate-pulse-attention" />
              <span className="absolute -top-2 -right-2 bg-destructive text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {pendingAlerts}
              </span>
            </div>
          )}

          {isAuthenticated && (
            <>
              {user?.isAdmin && (
                <Link to="/settings">
                  <Button variant="ghost" size="icon" title="Configurações">
                    <Settings className="h-5 w-5" />
                  </Button>
                </Link>
              )}
              
              <Button variant="ghost" size="icon" onClick={logout} title="Sair">
                <LogOut className="h-5 w-5" />
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default MainHeader;
