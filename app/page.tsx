'use client'

import { useEffect, useMemo, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

type Food = {
  id: string
  name: string
  grams?: number
  calories?: number
  protein?: number
  carbs?: number
  fat?: number
  data?: any
  [key: string]: any
}

export default function CaloriXApp() {
  const [foods, setFoods] = useState<Food[]>([])
  const [search, setSearch] = useState('')
  const [selectedFoods, setSelectedFoods] = useState<Food[]>([])
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  // ---------------- PARSE GOOGLE SHEETS ----------------
  function parseCSV(text: string) {
    const lines = text.trim().split('\n')
    const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim())

    return lines.slice(1).map((line, i) => {
      const cols = line.split(',')

      const obj: any = { id: i }

      headers.forEach((h, index) => {
        const key = h.toLowerCase()
        const value = cols[index]?.replace(/"/g, '')

        obj[key] =
          value && !isNaN(Number(value)) ? Number(value) : value
      })

      return obj
    }).filter(f => f.name)
  }

  // ---------------- LOAD DATA ----------------
  useEffect(() => {
    async function loadFoods() {
      const res = await fetch(
        'https://docs.google.com/spreadsheets/d/e/2PACX-1vTGsgfTLNO8W33sjozExwtwZ0hXxZFq5OJKfvl_q92uY-5EZUsN-miK4xs_uxytTEGDcaRdkzxUd7tB/pub?output=csv'
      )

      const text = await res.text()
      const parsed = parseCSV(text)

      setFoods(parsed)
    }

    loadFoods()
    loadMeals()
  }, [])

  // ---------------- LOAD SUPABASE MEALS ----------------
  async function loadMeals() {
    const { data } = await supabase
      .from('meals')
      .select('*')
      .order('created_at', { ascending: false })

    if (!data) return

    setSelectedFoods(
      data.map(m => ({
        id: m.id,
        name: m.name,
        grams: m.grams,
        calories: m.calories,
        protein: m.protein,
        carbs: m.carbs,
        fat: m.fat,
        data: m.data || {},
      }))
    )
  }

  // ---------------- SEARCH ----------------
  const filteredFoods = useMemo(() => {
    if (!search) return []

    return foods
      .filter(f =>
        f.name.toLowerCase().includes(search.toLowerCase())
      )
      .slice(0, 8)
  }, [search, foods])

  // ---------------- ADD FOOD (FIXED + COMPLETE) ----------------
  async function addFood(food: any) {
    const grams = prompt('How many grams?')
    if (!grams) return

    const amount = Number(grams)
    const multiplier = amount / 100

    const adjusted: any = {
      name: food.name,
      grams: amount,
      calories: Math.round((food.calories || 0) * multiplier),
      protein: Math.round((food.protein || 0) * multiplier),
      carbs: Math.round((food.carbs || 0) * multiplier),
      fat: Math.round((food.fat || 0) * multiplier),

      // extras dinámicos si existen en tu sheet
      fiber: food.fiber ? Math.round(food.fiber * multiplier) : null,
      sugar: food.sugar ? Math.round(food.sugar * multiplier) : null,
      water: food.water ? Math.round(food.water * multiplier) : null,

      data: food,
      id: `${Date.now()}`,
    }

    setSelectedFoods(prev => [adjusted, ...prev])

    await supabase.from('meals').insert({
      name: adjusted.name,
      calories: adjusted.calories,
      protein: adjusted.protein,
      carbs: adjusted.carbs,
      fat: adjusted.fat,
      grams: adjusted.grams,
      data: adjusted,
    })

    setSearch('')
  }

  // ---------------- TOGGLE EXPAND ----------------
  function toggleFood(id: string) {
    setExpanded(prev => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  // ---------------- DASHBOARD TOTALS ----------------
  const totals = selectedFoods.reduce(
    (acc, f) => {
      acc.calories += f.calories || 0
      acc.protein += f.protein || 0
      acc.carbs += f.carbs || 0
      acc.fat += f.fat || 0
      return acc
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  )

  return (
    <div className="min-h-screen bg-black text-white p-6">

      {/* DASHBOARD */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-zinc-900 p-4 rounded-xl">
          <p>Calories</p>
          <h2 className="text-3xl font-bold">{totals.calories}</h2>
        </div>

        <div className="bg-zinc-900 p-4 rounded-xl">
          <p>Protein</p>
          <h2 className="text-3xl font-bold">{totals.protein}g</h2>
        </div>

        <div className="bg-zinc-900 p-4 rounded-xl">
          <p>Carbs</p>
          <h2 className="text-3xl font-bold">{totals.carbs}g</h2>
        </div>

        <div className="bg-zinc-900 p-4 rounded-xl">
          <p>Fat</p>
          <h2 className="text-3xl font-bold">{totals.fat}g</h2>
        </div>
      </div>

      {/* SEARCH */}
      <input
        className="w-full p-4 bg-zinc-900 rounded-xl mb-4"
        placeholder="Search food..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      {/* RESULTS */}
      {search && (
        <div className="space-y-2 mb-6">
          {filteredFoods.map(food => (
            <button
              key={food.id}
              onClick={() => addFood(food)}
              className="w-full bg-zinc-900 p-4 rounded-xl text-left"
            >
              <div className="flex justify-between">
                <p className="font-bold">{food.name}</p>
                <p className="text-sm text-zinc-400">
                  {food.calories} kcal
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* SELECTED FOODS */}
      <div className="space-y-3">
        {selectedFoods.map(food => (
          <div key={food.id} className="bg-zinc-900 p-4 rounded-xl">

            {/* MAIN ROW */}
            <div className="flex justify-between">
              <div>
                <p className="font-bold">{food.name}</p>
                <p className="text-sm text-zinc-400">
                  {food.calories} kcal · {food.grams}g
                </p>
              </div>

              <div className="text-right text-sm">
                P {food.protein}g · C {food.carbs}g · F {food.fat}g
              </div>
            </div>

            {/* BUTTON */}
            <button
              onClick={() => toggleFood(food.id)}
              className="mt-3 text-xs bg-zinc-800 px-3 py-1 rounded"
            >
              {expanded[food.id] ? 'Hide details' : 'Expand details'}
            </button>

            {/* EXPANDED MACROS */}
            {expanded[food.id] && (
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-zinc-300">
                {Object.entries(food.data || food)
                  .filter(([k, v]) =>
                    typeof v === 'number' &&
                    !['calories','protein','carbs','fat','grams'].includes(k)
                  )
                  .map(([k, v]) => (
                    <p key={k}>
                      <span className="capitalize">{k}</span>
                      <span>{typeof v === 'number' ? v.toFixed(0) : String(v ?? '-')}</span>
                    </p>
                  ))}
              </div>
            )}

          </div>
        ))}
      </div>

    </div>
  )
}