'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function CaloriStyleFitnessApp() {
  const [foods, setFoods] = useState<any[]>([])  
  const [foodName, setFoodName] = useState('')
  const [calories, setCalories] = useState('')

  async function fetchFoods() {
    const { data } = await supabase
      .from('foods')
      .select('*')
      .order('id', { ascending: false })

    if (data) {
      setFoods(data)
    }
  }

  useEffect(() => {
    fetchFoods()
  }, [])

  async function addFood() {
    if (!foodName || !calories) return

    await supabase.from('foods').insert([
      {
        name: foodName,
        calories: Number(calories),
      },
    ])

    setFoodName('')
    setCalories('')

    fetchFoods()
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-6xl font-black mb-2">
          CALORI<span className="text-orange-500">X</span>
        </h1>

        <p className="text-zinc-400 mb-10">
          Track food. Train hard.
        </p>

        <div className="bg-zinc-900 rounded-3xl p-6 mb-8 border border-zinc-800">
          <h2 className="text-3xl font-bold mb-6">
            Add Food
          </h2>

          <div className="flex flex-col md:flex-row gap-4">
            <input
              placeholder="Food name"
              value={foodName}
              onChange={(e) => setFoodName(e.target.value)}
              className="bg-black border border-zinc-700 rounded-2xl px-4 py-3 flex-1 outline-none"
            />

            <input
              placeholder="Calories"
              type="number"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              className="bg-black border border-zinc-700 rounded-2xl px-4 py-3 w-40 outline-none"
            />

            <button
              onClick={addFood}
              className="bg-orange-500 hover:bg-orange-400 text-black px-6 py-3 rounded-2xl font-bold"
            >
              Add
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {foods.map((food) => (
            <div
              key={food.id}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5"
            >
              <div className="flex justify-between">
                <div>
                  <h3 className="text-2xl font-bold">
                    {food.name}
                  </h3>

                  <p className="text-zinc-400">
                    {food.calories} kcal
                  </p>
                </div>

                <div className="text-3xl">
                  🍗
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}