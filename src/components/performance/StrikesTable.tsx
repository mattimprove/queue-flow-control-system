
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { StrikeData } from "@/services/performance";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface StrikesTableProps {
  strikes: StrikeData[];
  isLoading: boolean;
}

const StrikesTable = ({ strikes, isLoading }: StrikesTableProps) => {
  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const getSeverityBadge = (strikes: number) => {
    if (strikes >= 5) return <Badge variant="destructive">Crítico</Badge>;
    if (strikes >= 3) return <Badge variant="default" className="bg-orange-500">Atenção</Badge>;
    return <Badge variant="outline" className="text-amber-500 border-amber-500">Leve</Badge>;
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Atraso (Strikes)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">Carregando dados...</div>
        </CardContent>
      </Card>
    );
  }

  if (!strikes.length) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Atraso (Strikes)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">Não há tickets em atraso no momento. Ótimo trabalho!</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-red-500" />
          Atraso (Strikes)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Atendente</TableHead>
              <TableHead className="text-right">Tickets em Atraso</TableHead>
              <TableHead className="w-[120px]">Severidade</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {strikes.map((strike) => (
              <TableRow key={strike.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={strike.url_imagem} alt={strike.nome} />
                      <AvatarFallback>{getInitials(strike.nome)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{strike.nome}</div>
                      <div className="text-xs text-muted-foreground">{strike.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right font-medium">{strike.tickets_em_atraso}</TableCell>
                <TableCell>{getSeverityBadge(strike.tickets_em_atraso)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default StrikesTable;
