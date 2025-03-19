export const SkeletonLoading = () => {
  return (
    <div className="space-y-2">
      {[...Array(5)].map((_, index) => (
        <div key={index} className="animate-pulse h-12 w-full bg-gray-300 rounded-md"></div>
      ))}
    </div>
  );
};
