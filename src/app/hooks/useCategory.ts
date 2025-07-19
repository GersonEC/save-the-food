import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useCategory = () => {
  const query = useQuery({
    queryKey: ['category'],
    queryFn: async () => {
      const response = await fetch('/api/category');
      if (!response.ok) {
        throw new Error('Errore nel recupero delle categorie');
      }
      const data = await response.json();
      return data;
    },
  });

  const mutation = useMutation({
    mutationFn: async (name: string) => {
      const response = await fetch('/api/category', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      });
      if (!response.ok) {
        throw new Error("Errore nell'aggiunta della categoria");
      }
      return response.json();
    },
    onSuccess: () => {
      toast.success('Categoria aggiunta con successo');
      query.refetch();
    },
    onError: (error) => {
      console.error("Errore nell'aggiunta della categoria:", error);
      toast.error("Errore nell'aggiunta della categoria");
    },
  });

  return { query, mutation };
};
