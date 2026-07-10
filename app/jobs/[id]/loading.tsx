export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 lg:py-12 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 animate-pulse">
          
          {/* Left Side */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header Skeleton */}
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <div className="w-24 h-24 rounded-2xl bg-secondary/30 shrink-0" />
              
              <div className="space-y-4 flex-1 w-full pt-1">
                <div className="h-8 bg-secondary/30 rounded-lg w-3/4" />
                <div className="flex flex-wrap gap-4">
                  <div className="h-5 bg-secondary/30 rounded w-24" />
                  <div className="h-5 bg-secondary/30 rounded w-20" />
                  <div className="h-5 bg-secondary/30 rounded w-24" />
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  <div className="h-6 bg-secondary/30 rounded-full w-20" />
                  <div className="h-6 bg-secondary/30 rounded-full w-24" />
                </div>
              </div>
            </div>

            <hr className="border-border/50" />

            {/* Sections Skeleton */}
            {[1, 2, 3].map((section) => (
              <section key={section} className="space-y-4">
                <div className="h-6 bg-secondary/30 rounded w-48" />
                <div className="space-y-3">
                  <div className="h-4 bg-secondary/30 rounded w-full" />
                  <div className="h-4 bg-secondary/30 rounded w-11/12" />
                  <div className="h-4 bg-secondary/30 rounded w-10/12" />
                  {section === 1 && <div className="h-4 bg-secondary/30 rounded w-full mt-4" />}
                  {section === 1 && <div className="h-4 bg-secondary/30 rounded w-9/12" />}
                </div>
              </section>
            ))}

            {/* Skills Skeleton */}
            <section className="space-y-4 pt-2">
              <div className="h-6 bg-secondary/30 rounded w-32" />
              <div className="flex flex-wrap gap-2.5">
                {[1, 2, 3, 4, 5, 6].map((skill) => (
                  <div key={skill} className="h-9 w-20 bg-secondary/30 rounded-xl" />
                ))}
              </div>
            </section>
          </div>

          {/* Right Sidebar Skeleton */}
          <div className="lg:col-span-1 space-y-6">
            <div className="sticky top-8 space-y-6">
              {/* Action Card Skeleton */}
              <div className="p-6 bg-card/40 border border-border/50 shadow-xl rounded-[2rem] space-y-6">
                <div className="flex flex-col items-center justify-center pb-6 border-b border-border/50 gap-4">
                  <div className="h-3 w-24 bg-secondary/30 rounded" />
                  <div className="w-32 h-32 rounded-full bg-secondary/30" />
                </div>
                <div className="space-y-4">
                  <div className="h-14 w-full bg-secondary/30 rounded-xl" />
                  <div className="h-14 w-full bg-secondary/30 rounded-xl" />
                </div>
              </div>

              {/* CareerChemistry Skeleton */}
              <div className="p-6 bg-card/40 border border-border/50 shadow-xl rounded-[2rem] space-y-6">
                <div className="flex flex-col items-center">
                  <div className="h-6 w-40 bg-secondary/30 rounded mb-2" />
                  <div className="h-4 w-48 bg-secondary/30 rounded" />
                </div>
                <div className="space-y-6 mt-8">
                  {[1, 2, 3, 4].map((item) => (
                    <div key={item} className="space-y-2">
                      <div className="flex justify-between">
                        <div className="h-4 w-24 bg-secondary/30 rounded" />
                        <div className="h-4 w-8 bg-secondary/30 rounded" />
                      </div>
                      <div className="h-2 w-full bg-secondary/20 rounded-full overflow-hidden">
                        <div className="h-full w-2/3 bg-secondary/40 rounded-full" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
