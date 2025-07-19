import { Food } from '@/domain/Food';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

// Type for food data as it comes from JSON (with string dates)
type FoodFromJSON = Omit<Food, 'expirationDate'> & {
  expirationDate: string;
};

export const useFood = () => {
  const router = useRouter();

  const query = useQuery({
    queryKey: ['food'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/food');
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
  });

  const mutation = useMutation({
    mutationFn: async (food: Food) => {
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

  return { query, mutation };
};
