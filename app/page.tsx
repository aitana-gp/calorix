'use client'

import { useEffect, useMemo, useState } from 'react'

export default function CaloriXApp() {
  const [foods, setFoods] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [selectedFoods, setSelectedFoods] = useState<any[]>([])

  useEffect(() => {
    async function loadFoods() {
      const res = await fetch(
        'https://docs.google.com/spreadsheets/d/e/2PACX-1vTGsgfTLNO8W33sjozExwtwZ0hXxZFq5OJKfvl_q92uY-5EZUsN-miK4xs_uxytTEGDcaRdkzxUd7tB/pub?output=csv'
      )

      const text = await res.text()

      const rows = text.split('\n').slice(1)

      const parsedFoods = rows
        .map((row) => {
          const cols = row.split(',')

          return {
            name: cols[0]?.replace(/"/g, ''),
            calories: Number(cols[1]),
            protein: Number(cols[2]),
            carbs: Number(cols[3]),
            fat: Number(cols[4]),
          }
        })
        .filter((food) => food.name)

      setFoods(parsedFoods)
    }

    loadFoods()
  }, [])

  const filteredFoods = useMemo(() => {
    if (!search) return []

    return foods
      .filter((food) =>
        food.name.toLowerCase().includes(search.toLowerCase())
      )
      .slice(0, 8)
  }, [search, foods])

  function addFood(food: any) {
  const grams = prompt('How many grams?')

  if (!grams) return

  const amount = Number(grams)

  const multiplier = amount / 100

  const adjustedFood = {
    ...food,
    grams: amount,
    calories: Math.round(food.calories * multiplier),
    protein: Math.round(food.protein * multiplier),
    carbs: Math.round(food.carbs * multiplier),
    fat: Math.round(food.fat * multiplier),
  }

  setSelectedFoods((prev) => [...prev, adjustedFood])

  setSearch('')
}

  const totals = selectedFoods.reduce(
    (acc, food) => {
      acc.calories += food.calories || 0
      acc.protein += food.protein || 0
      acc.carbs += food.carbs || 0
      acc.fat += food.fat || 0

      return acc
    },
    {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
    }
  )

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#ff4d00_0%,transparent_30%),radial-gradient(circle_at_bottom_left,#ff0055_0%,transparent_35%)] opacity-30" />

      <div className="relative z-10 max-w-6xl mx-auto p-6 md:p-10">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-6xl md:text-7xl font-black tracking-tight">
              CALORI<span className="text-orange-500">X</span>
            </h1>

            <p className="text-zinc-400 mt-2 text-lg">
              Track food. Train hard. Look unreal.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6">
            <p className="text-zinc-500 uppercase text-xs tracking-[0.2em]">
              Calories
            </p>

            <h2 className="text-6xl font-black mt-4">
              {totals.calories}
            </h2>

            <div className="mt-6 w-full bg-zinc-900 rounded-full h-4 overflow-hidden">
              <div
                className="bg-gradient-to-r from-orange-500 to-pink-500 h-full rounded-full"
                style={{
                  width: `${Math.min(
                    (totals.calories / 2500) * 100,
                    100
                  )}%`,
                }}
              />
            </div>

            <div className="flex justify-between mt-3 text-sm text-zinc-400">
              <span>Daily Progress</span>
              <span>2500 goal</span>
            </div>
          </div>

          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6">
            <p className="text-zinc-500 uppercase text-xs tracking-[0.2em] mb-5">
              Macros
            </p>

            <div className="space-y-5">
              <MacroBar
                label="Protein"
                value={totals.protein}
                color="bg-orange-500"
              />

              <MacroBar
                label="Carbs"
                value={totals.carbs}
                color="bg-pink-500"
              />

              <MacroBar
                label="Fat"
                value={totals.fat}
                color="bg-yellow-400"
              />
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-pink-600 rounded-3xl p-6 text-black">
            <p className="uppercase text-xs tracking-[0.2em] font-bold opacity-70">
              Foods Database
            </p>

            <h2 className="text-7xl font-black mt-4">
              {foods.length}
            </h2>

            <p className="font-semibold text-lg mt-2">
              foods loaded
            </p>
          </div>
        </div>

        <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 mb-8">
          <h3 className="text-3xl font-black mb-6">
            Search Foods
          </h3>

          <input
            type="text"
            placeholder="Search foods..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-4 text-lg outline-none focus:border-orange-500"
          />

          {search && (
            <div className="mt-4 space-y-3">
              {filteredFoods.map((food, index) => (
                <button
                  key={index}
                  onClick={() => addFood(food)}
                  className="w-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-2xl p-4 text-left transition-all"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-lg">
                        {food.name}
                      </h4>

                      <p className="text-zinc-400">
                        {food.calories} kcal · {food.grams}g
                      </p>
                    </div>

                    <div className="text-right text-sm text-zinc-400">
                      <p>P {food.protein}g</p>
                      <p>C {food.carbs}g</p>
                      <p>F {food.fat}g</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6">
          <h3 className="text-3xl font-black mb-6">
            Today's Foods
          </h3>

          <div className="space-y-4">
            {selectedFoods.map((food, index) => (
              <div
                key={index}
                className="bg-zinc-900 rounded-2xl p-5 border border-zinc-800"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-xl">
                      {food.name}
                    </h4>

                    <p className="text-zinc-400">
                      {food.calories} kcal · {food.grams}g
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-orange-400">
                      P {food.protein}g
                    </p>

                    <p className="text-pink-400">
                      C {food.carbs}g
                    </p>

                    <p className="text-yellow-400">
                      F {food.fat}g
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {selectedFoods.length === 0 && (
              <div className="text-zinc-500 text-center py-10">
                No foods added yet
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function MacroBar({
  label,
  value,
  color,
}: {
  label: string
  value: number
  color: string
}) {
  return (
    <div>
      <div className="flex justify-between mb-2">
        <span className="font-semibold">
          {label}
        </span>

        <span>
          {value}g
        </span>
      </div>

      <div className="h-3 bg-zinc-900 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full`}
          style={{
            width: `${Math.min(value, 100)}%`,
          }}
        />
      </div>
    </div>
  )
}