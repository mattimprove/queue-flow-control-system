
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Bell, Settings, LogOut } from "lucide-react";
import { Link } from "react-router-dom";

interface MainHeaderProps {
  title: string;
  pendingAlerts: number;
}

const MainHeader = ({ title, pendingAlerts = 0 }: MainHeaderProps) => {
  const { logout, isAuthenticated } = useAuth();

  return (
    <header className="bg-card p-4 border-b border-border sticky top-0 z-10">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-5">
          <img 
            src="/lovable-uploads/4c7404d8-ef38-4ae1-b736-66ac06729fc0.png" 
            alt="Sling Logo" 
            className="h-12 w-auto transition-all hover:scale-105" 
          />
          <h1 className="text-2xl font-bold text-primary">{title}</h1>
        </div>

        <div className="flex items-center gap-2">
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
              <Link to="/settings">
                <Button variant="ghost" size="icon">
                  <Settings className="h-5 w-5" />
                </Button>
              </Link>
              
              <Button variant="ghost" size="icon" onClick={logout}>
                <LogOut className="h-5 w-5" />
              </Button>
            </>
          )}
        </div>
      </div>
      <div className="mt-3 text-xs text-center text-muted-foreground">
        <div className="flex items-center justify-center gap-2">
          <p>Produzido pela Sling Soluções de Mercado</p>
          <a href="https://www.slingbr.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary">
            <i className="fas fa-globe text-sm"></i>
          </a>
          <a href="https://www.instagram.com/slingbr_" target="_blank" rel="noopener noreferrer" className="hover:text-primary">
            <i className="fab fa-instagram text-sm"></i>
          </a>
        </div>
      </div>
    </header>
  );
};

export default MainHeader;
