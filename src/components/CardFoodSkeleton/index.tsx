export const CardFoodSkeleton = () => {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4'>
      {Array.from({ length: 3 }).map((_, index) => (
        <li key={index} className='list-none'>
          <div className='w-full flex gap-4 p-2 rounded-xl border-1 border-gray-100 shadow-sm h-28 bg-gray-100'>
            <div className='flex justify-center items-center w-1/6'>
              <div className='w-[100px] h-[70px] rounded-xl bg-gray-200 animate-pulse' />
            </div>
            <div className='flex flex-col gap-2 flex-1'>
              <div className='flex justify-between items-center'>
                <div className='h-4 w-[150px] bg-gray-200 rounded animate-pulse' />
                <div className='flex items-center gap-1'>
                  <div className='h-6 w-20 bg-gray-200 rounded animate-pulse' />
                  <div className='h-6 w-6 bg-gray-200 rounded animate-pulse' />
                </div>
              </div>
              <div className='flex justify-between items-end w-full'>
                <div className='flex flex-col gap-1'>
                  <div className='h-3 w-32 bg-gray-200 rounded animate-pulse' />
                  <div className='h-3 w-24 bg-gray-200 rounded animate-pulse' />
                </div>
                <div className='w-1/4'>
                  <div className='h-2 w-full bg-gray-200 rounded animate-pulse' />
                </div>
              </div>
            </div>
          </div>
        </li>
      ))}
    </div>
  );
};
