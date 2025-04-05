
import { useState, useEffect } from "react";
import { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Trophy, Award, Medal } from "lucide-react";
import { AttendantPerformance } from "@/services/performance";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";

interface PerformanceRankingProps {
  attendants: AttendantPerformance[];
  isLoading: boolean;
}

const PerformanceRanking = ({ attendants, isLoading }: PerformanceRankingProps) => {
  const [fastestTime, setFastestTime] = useState<number>(0);
  
  useEffect(() => {
    if (attendants.length > 0) {
      setFastestTime(attendants[0].tempo_medio_segundos);
    }
  }, [attendants]);

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const getMedalIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Medal className="h-5 w-5 text-amber-600" />;
      default:
        return null;
    }
  };

  const getPerformanceColor = (seconds: number) => {
    // Quanto mais próximo ao melhor tempo (ou menor), melhor a cor
    const ratio = fastestTime / seconds;
    if (ratio > 0.9) return "bg-green-500";
    if (ratio > 0.7) return "bg-emerald-500";
    if (ratio > 0.5) return "bg-amber-500";
    if (ratio > 0.3) return "bg-orange-500";
    return "bg-red-500";
  };

  if (isLoading) {
    return (
      <Card className="w-full mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Ranking de Atendimento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">Carregando dados...</div>
        </CardContent>
      </Card>
    );
  }

  if (!attendants.length) {
    return (
      <Card className="w-full mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Ranking de Atendimento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">Não há dados de desempenho disponíveis ainda.</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          Ranking de Atendimento
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">Pos</TableHead>
              <TableHead>Atendente</TableHead>
              <TableHead className="text-right">Tickets</TableHead>
              <TableHead className="text-right">Tempo Médio</TableHead>
              <TableHead className="w-[200px]">Desempenho</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {attendants.map((attendant, index) => (
              <TableRow key={attendant.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center justify-center">
                    {getMedalIcon(index + 1) || (index + 1)}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={attendant.url_imagem} alt={attendant.nome} />
                      <AvatarFallback>{getInitials(attendant.nome)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{attendant.nome}</div>
                      <div className="text-xs text-muted-foreground">{attendant.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right font-medium">{attendant.tickets_atendidos}</TableCell>
                <TableCell className="text-right font-medium">{attendant.tempo_medio_formatado}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress 
                      value={((fastestTime / attendant.tempo_medio_segundos) * 100)} 
                      className={getPerformanceColor(attendant.tempo_medio_segundos)}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default PerformanceRanking;
