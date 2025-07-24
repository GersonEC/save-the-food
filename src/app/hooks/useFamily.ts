import { useQuery } from '@tanstack/react-query';
import { useAccessCode } from '@/app/providers/AccessCodeProvider';
import { toast } from 'sonner';

export const useFamily = () => {
  const { accessCode } = useAccessCode();

  const query = useQuery({
    queryKey: ['family', accessCode],
    queryFn: async () => {
      if (!accessCode) {
        throw new Error('Access code required');
      }

      try {
        const response = await fetch(`/api/family?accessCode=${accessCode}`);
        if (!response.ok) {
          throw new Error('Errore nel recupero dei dati della famiglia');
        }
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Error fetching family data:', error);
        toast.error('Errore nel recupero dei dati della famiglia');
        return null;
      }
    },
    enabled: !!accessCode,
  });

  return { query };
};
