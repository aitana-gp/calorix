'use client'

export default function CaloriStyleFitnessApp() {
  const meals = [
    {
      name: 'Protein Pancakes',
      calories: 520,
      protein: '42g',
    },
    {
      name: 'Chicken Bowl',
      calories: 680,
      protein: '55g',
    },
    {
      name: 'Greek Yogurt',
      calories: 240,
      protein: '21g',
    },
  ];

  const workouts = [
    {
      name: 'Push Day',
      duration: '1h 12m',
      volume: '12,450kg',
    },
    {
      name: 'Leg Day',
      duration: '58m',
      volume: '15,900kg',
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#ff4d00_0%,transparent_30%),radial-gradient(circle_at_bottom_left,#ff0055_0%,transparent_35%)] opacity-30" />

      <div className="relative z-10 p-6 md:p-10 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight">
              CALORI<span className="text-orange-500">X</span>
            </h1>
            <p className="text-zinc-400 mt-2 text-lg">
              Track food. Train hard. Look unreal.
            </p>
          </div>

          <button className="bg-orange-500 hover:bg-orange-400 transition-all px-6 py-3 rounded-2xl font-bold text-black shadow-[0_0_40px_rgba(255,115,0,0.5)]">
            + Add Meal
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 backdrop-blur-xl shadow-2xl">
            <div className="flex justify-between items-start mb-8">
              <div>
                <p className="text-zinc-500 uppercase text-xs tracking-[0.2em]">
                  Calories
                </p>
                <h2 className="text-6xl font-black mt-2">2,140</h2>
              </div>

              <div className="w-16 h-16 rounded-2xl bg-orange-500/20 border border-orange-500 flex items-center justify-center text-orange-400 text-2xl">
                🔥
              </div>
            </div>

            <div className="w-full bg-zinc-900 rounded-full h-4 overflow-hidden">
              <div className="bg-gradient-to-r from-orange-500 to-pink-500 h-full w-[72%] rounded-full" />
            </div>

            <div className="flex justify-between mt-3 text-sm text-zinc-400">
              <span>72% of goal</span>
              <span>2,950 target</span>
            </div>
          </div>

          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 shadow-2xl">
            <p className="text-zinc-500 uppercase text-xs tracking-[0.2em] mb-5">
              Macros
            </p>

            <div className="space-y-5">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-semibold">Protein</span>
                  <span className="text-orange-400">172g</span>
                </div>
                <div className="h-3 bg-zinc-900 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500 w-[80%] rounded-full" />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-semibold">Carbs</span>
                  <span className="text-pink-400">201g</span>
                </div>
                <div className="h-3 bg-zinc-900 rounded-full overflow-hidden">
                  <div className="h-full bg-pink-500 w-[65%] rounded-full" />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-semibold">Fats</span>
                  <span className="text-yellow-400">61g</span>
                </div>
                <div className="h-3 bg-zinc-900 rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-400 w-[50%] rounded-full" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-pink-600 rounded-3xl p-6 text-black shadow-[0_0_50px_rgba(255,100,0,0.45)]">
            <p className="uppercase text-xs tracking-[0.2em] font-bold opacity-70">
              Workout Streak
            </p>

            <h2 className="text-7xl font-black mt-4">18</h2>

            <p className="font-semibold text-lg mt-2">
              days locked in
            </p>

            <button className="mt-8 bg-black text-white px-5 py-3 rounded-2xl font-bold hover:scale-105 transition-all">
              Start Workout
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-3xl font-black">Meals</h3>
                <p className="text-zinc-500">
                  Your custom food database
                </p>
              </div>

              <button className="bg-white text-black px-4 py-2 rounded-xl font-bold hover:scale-105 transition-all">
                + Food
              </button>
            </div>

            <div className="space-y-4">
              {meals.map((meal, index) => (
                <div
                  key={index}
                  className="bg-zinc-900 rounded-2xl p-5 border border-zinc-800 hover:border-orange-500 transition-all"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-lg">{meal.name}</h4>
                      <p className="text-zinc-500">
                        {meal.calories} kcal · {meal.protein} protein
                      </p>
                    </div>

                    <button className="bg-orange-500 text-black px-4 py-2 rounded-xl font-bold hover:bg-orange-400 transition-all">
                      Log
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-3xl font-black">Workouts</h3>
                <p className="text-zinc-500">
                  Heavy sessions only
                </p>
              </div>

              <button className="bg-orange-500 text-black px-4 py-2 rounded-xl font-bold hover:bg-orange-400 transition-all">
                + Session
              </button>
            </div>

            <div className="space-y-4">
              {workouts.map((workout, index) => (
                <div
                  key={index}
                  className="bg-zinc-900 rounded-2xl p-5 border border-zinc-800 hover:border-pink-500 transition-all"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-lg">{workout.name}</h4>
                      <p className="text-zinc-500">
                        {workout.duration} · {workout.volume}
                      </p>
                    </div>

                    <div className="text-3xl">🏋️</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 bg-zinc-950 border border-zinc-800 rounded-3xl p-6 shadow-2xl">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-3xl font-black">Analytics</h3>
              <p className="text-zinc-500">
                Visual progress tracking
              </p>
            </div>

            <div className="flex gap-3">
              <button className="bg-zinc-900 px-4 py-2 rounded-xl font-semibold hover:bg-zinc-800">
                Week
              </button>
              <button className="bg-orange-500 text-black px-4 py-2 rounded-xl font-bold">
                Month
              </button>
            </div>
          </div>

          <div className="h-72 rounded-3xl bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 flex items-end justify-between p-6 gap-4 overflow-hidden">
            {[40, 55, 62, 48, 70, 88, 95].map((height, index) => (
              <div
                key={index}
                className="flex-1 rounded-t-3xl bg-gradient-to-t from-orange-500 to-pink-500 hover:scale-105 transition-all"
                style={{ height: `${height}%` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
