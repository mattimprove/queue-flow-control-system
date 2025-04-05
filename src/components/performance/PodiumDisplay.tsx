
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Medal } from "lucide-react";
import { AttendantPerformance } from "@/services/performance";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

interface PodiumDisplayProps {
  attendants: AttendantPerformance[];
  isLoading: boolean;
}

const PodiumDisplay = ({ attendants, isLoading }: PodiumDisplayProps) => {
  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  if (isLoading) {
    return (
      <Card className="w-full mb-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Pódio de Atendimento
          </CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
          <div className="text-center py-8">Carregando dados...</div>
        </CardContent>
      </Card>
    );
  }

  if (!attendants.length) {
    return (
      <Card className="w-full mb-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Pódio de Atendimento
          </CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
          <div className="text-center py-8">Não há dados de desempenho disponíveis ainda.</div>
        </CardContent>
      </Card>
    );
  }

  // Garantir que temos exatamente 3 posições ou menos
  const podiumPositions = attendants.slice(0, 3);
  
  // Preencher posições ausentes se necessário
  while (podiumPositions.length < 3) {
    podiumPositions.push(null as any);
  }

  return (
    <Card className="w-full mb-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          Pódio de Atendimento
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center">
          {/* Pódio estilo F1 */}
          <div className="flex justify-center items-end w-full gap-4 py-4">
            {/* 2º Lugar */}
            <div className="flex flex-col items-center">
              <div className="mb-2 flex flex-col items-center">
                {podiumPositions[1] ? (
                  <>
                    <Avatar className="w-16 h-16 mb-1 border-2 border-gray-400">
                      <AvatarImage src={podiumPositions[1].url_imagem} alt={podiumPositions[1].nome} />
                      <AvatarFallback>{getInitials(podiumPositions[1].nome)}</AvatarFallback>
                    </Avatar>
                    <div className="text-sm font-medium text-center">
                      {podiumPositions[1].nome.split(' ')[0]}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {podiumPositions[1].tempo_medio_formatado}
                    </div>
                  </>
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">2</span>
                  </div>
                )}
              </div>
              <div className="h-24 w-20 bg-gray-200 flex items-center justify-center rounded-t-lg">
                <Medal className="h-8 w-8 text-gray-400" />
              </div>
            </div>

            {/* 1º Lugar */}
            <div className="flex flex-col items-center">
              <div className="mb-2 flex flex-col items-center">
                {podiumPositions[0] ? (
                  <>
                    <Avatar className="w-20 h-20 mb-1 border-2 border-yellow-500">
                      <AvatarImage src={podiumPositions[0].url_imagem} alt={podiumPositions[0].nome} />
                      <AvatarFallback>{getInitials(podiumPositions[0].nome)}</AvatarFallback>
                    </Avatar>
                    <div className="text-sm font-medium text-center">
                      {podiumPositions[0].nome.split(' ')[0]}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {podiumPositions[0].tempo_medio_formatado}
                    </div>
                  </>
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">1</span>
                  </div>
                )}
              </div>
              <div className="h-32 w-24 bg-yellow-100 flex items-center justify-center rounded-t-lg">
                <Trophy className="h-10 w-10 text-yellow-500" />
              </div>
            </div>

            {/* 3º Lugar */}
            <div className="flex flex-col items-center">
              <div className="mb-2 flex flex-col items-center">
                {podiumPositions[2] ? (
                  <>
                    <Avatar className="w-14 h-14 mb-1 border-2 border-amber-700">
                      <AvatarImage src={podiumPositions[2].url_imagem} alt={podiumPositions[2].nome} />
                      <AvatarFallback>{getInitials(podiumPositions[2].nome)}</AvatarFallback>
                    </Avatar>
                    <div className="text-sm font-medium text-center">
                      {podiumPositions[2].nome.split(' ')[0]}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {podiumPositions[2].tempo_medio_formatado}
                    </div>
                  </>
                ) : (
                  <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">3</span>
                  </div>
                )}
              </div>
              <div className="h-16 w-18 bg-amber-100 flex items-center justify-center rounded-t-lg">
                <Medal className="h-6 w-6 text-amber-700" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PodiumDisplay;
