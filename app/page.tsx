'use client'

import { useEffect, useMemo, useState } from 'react'

type Food = {
  id: string
  name: string
  grams?: number
  [key: string]: any
}

export default function CaloriXApp() {
  const [foods, setFoods] = useState<Food[]>([])
  const [search, setSearch] = useState('')
  const [selectedFoods, setSelectedFoods] = useState<Food[]>([])
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  useEffect(() => {
    async function loadFoods() {
      const res = await fetch(
        'https://docs.google.com/spreadsheets/d/e/2PACX-1vTGsgfTLNO8W33sjozExwtwZ0hXxZFq5OJKfvl_q92uY-5EZUsN-miK4xs_uxytTEGDcaRdkzxUd7tB/pub?output=csv'
      )

      const text = await res.text()
      const rows = text.trim().split('\n')

      const headers = rows[0].split(',').map(h => h.replace(/"/g, '').trim())

      const parsedFoods = rows.slice(1).map((row, index) => {
        const cols = row.split(',')

        const obj: any = {
          id: `${index}-${cols[0]}`,
        }

        headers.forEach((header, i) => {
          const key = header.toLowerCase()
          const value = cols[i]?.replace(/"/g, '')

          obj[key] =
            isNaN(Number(value)) || value === ''
              ? value
              : Number(value)
        })

        return obj
      }).filter(f => f.name)

      setFoods(parsedFoods)
    }

    loadFoods()
  }, [])

  const filteredFoods = useMemo(() => {
    if (!search) return []
    return foods
      .filter(f => f.name?.toLowerCase().includes(search.toLowerCase()))
      .slice(0, 8)
  }, [search, foods])

  function addFood(food: Food) {
    const grams = prompt('How many grams?')
    if (!grams) return

    const amount = Number(grams)
    const multiplier = amount / 100

    const adjusted: Food = {
      ...food,
      grams: amount,
      id: `${food.id}-${Date.now()}`,
    }

    // scale ALL numeric macros dynamically
    Object.keys(adjusted).forEach(key => {
      if (
        key !== 'name' &&
        key !== 'id' &&
        typeof adjusted[key] === 'number'
      ) {
        adjusted[key] = Math.round(adjusted[key] * multiplier)
      }
    })

    setSelectedFoods(prev => [...prev, adjusted])
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
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  )

  function toggleFood(id: string) {
    setExpanded(prev => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <div className="relative z-10 max-w-6xl mx-auto p-6 md:p-10">

        {/* HEADER */}
        <h1 className="text-6xl font-black mb-10">
          CALORI<span className="text-orange-500">X</span>
        </h1>

        {/* SEARCH */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 mb-8">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search foods..."
            className="w-full bg-zinc-900 p-4 rounded-xl"
          />

          {search && (
            <div className="mt-4 space-y-3">
              {filteredFoods.map(food => (
                <button
                  key={food.id}
                  onClick={() => addFood(food)}
                  className="w-full bg-zinc-900 p-4 rounded-xl text-left"
                >
                  <div className="flex justify-between">
                    <div>
                      <p className="font-bold">{food.name}</p>
                      <p className="text-sm text-zinc-400">
                        {food.calories} kcal
                      </p>
                    </div>

                    <div className="text-sm text-right text-zinc-400">
                      P {food.protein}g · C {food.carbs}g · F {food.fat}g
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* SELECTED FOODS */}
        <div className="space-y-4">
          {selectedFoods.map(food => {
            const isOpen = expanded[food.id]

            return (
              <div
                key={food.id}
                onClick={() => toggleFood(food.id)}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 cursor-pointer"
              >
                {/* COLLAPSED VIEW */}
                <div className="flex justify-between">
                  <div>
                    <p className="text-xl font-bold">{food.name}</p>
                    <p className="text-zinc-400">
                      {food.calories} kcal · {food.grams}g
                    </p>
                  </div>

                  <div className="text-right text-sm">
                    <p>P {food.protein}g</p>
                    <p>C {food.carbs}g</p>
                    <p>F {food.fat}g</p>
                  </div>
                </div>

                {/* EXPANDED VIEW */}
                {isOpen && (
                  <div className="mt-4 pt-4 border-t border-zinc-700 grid grid-cols-2 gap-2 text-sm text-zinc-300">
                    {Object.entries(food)
                      .filter(([k, v]) =>
                        typeof v === 'number' &&
                        !['calories','protein','carbs','fat','grams'].includes(k)
                      )
                      .map(([k, v]) => (
                        <div key={k} className="flex justify-between">
                          <span className="capitalize">{k}</span>
                          <span>{v}</span>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {selectedFoods.length === 0 && (
          <p className="text-center text-zinc-500 mt-10">
            No foods added yet
          </p>
        )}

      </div>
    </div>
  )
}