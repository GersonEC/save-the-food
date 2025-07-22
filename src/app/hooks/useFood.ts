import { Food } from '@/domain/Food';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAccessCode } from '@/app/providers/AccessCodeProvider';

// Type for food data as it comes from JSON (with string dates)
type FoodFromJSON = Omit<Food, 'expirationDate'> & {
  expirationDate: string;
};

export const useFood = () => {
  const router = useRouter();
  const { accessCode } = useAccessCode();

  const query = useQuery({
    queryKey: ['food', accessCode],
    queryFn: async () => {
      if (!accessCode) {
        throw new Error('Access code required');
      }

      try {
        const response = await fetch(`/api/food?accessCode=${accessCode}`);
        if (!response.ok) {
          throw new Error('Errore nel recupero dei dati');
        }
        const data = await response.json();
        // Convert string dates back to Date objects
        const foodWithDates = data.map((item: FoodFromJSON) => ({
          ...item,
          expirationDate: new Date(item.expirationDate),
        }));
        return foodWithDates as Food[];
      } catch (error) {
        console.error('Error fetching food data:', error);
        toast.error('Errore nel recupero dei dati');
        return [];
      }
    },
    enabled: !!accessCode,
  });

  const mutation = useMutation({
    mutationFn: async (food: Food) => {
      if (!accessCode) {
        toast.error('Codice di accesso non valido');
        throw new Error('Access code required');
      }

      // Send the new food data to the API
      const { name, category, location, expirationDate, quantity, image } =
        food;
      const response = await fetch('/api/food', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          category: category.name,
          location,
          expirationDate,
          quantity,
          image: image || undefined,
          accessCode,
        }),
      });
      if (!response.ok) {
        throw new Error("Errore nell'aggiunta del cibo");
      }
      return response.json();
    },
    onSuccess: () => {
      toast.success('Cibo aggiunto con successo');
      query.refetch();
      router.push('/');
    },
    onError: (error) => {
      console.error('Error adding food:', error);
      toast.error('Si è verificato un errore di connessione');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (foodId: string) => {
      if (!accessCode) {
        throw new Error('Access code required');
      }

      const response = await fetch('/api/food', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: foodId,
          accessCode,
        }),
      });
      if (!response.ok) {
        throw new Error('Errore nella cancellazione del cibo');
      }
      return response.json();
    },
    onSuccess: () => {
      toast.success('Cibo cancellato con successo');
      query.refetch();
    },
    onError: (error) => {
      console.error('Error deleting food:', error);
      toast.error('Si è verificato un errore nella cancellazione');
    },
  });

  return { query, mutation, deleteMutation };
};
