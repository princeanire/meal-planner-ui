'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"

export default function MealPlanGenerator() {
  const [preferences, setPreferences] = useState({
    dietType: '',
    calories: 2000,
    meals: '3',
    allergies: '',
  })
  const [mealPlan, setMealPlan] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPreferences(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string) => (value: string) => {
    setPreferences(prev => ({ ...prev, [name]: value }))
  }

  const handleSliderChange = (value: number[]) => {
    setPreferences(prev => ({ ...prev, calories: value[0] }))
  }

  const generateMealPlan = async () => {
    const url = new URL('http://meal-planner-ai-env.eba-hfbjk7ac.us-east-1.elasticbeanstalk.com/generate/meal-plan')
    const message = `DietType:${preferences.dietType}-NumberOfMealsPerDay:${preferences.meals}-DailyCalorieGoal:${preferences.calories}-Allergies:${preferences.allergies}`
    url.searchParams.append('message', message)
    try {
      const aiGeneratedMealPlan = await fetch(url, {
        method: "GET"
      })

      const text = await aiGeneratedMealPlan.text()
      console.log(text)
      setMealPlan(text)

    }
    catch (error) {
      console.log(error)
    }
  }
  return (
    <>
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Personalized Meal Plan Generator</CardTitle>
          <CardDescription>Input your dietary preferences and goals to generate a customized meal plan.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="dietType">Diet Type</Label>
            <Select onValueChange={handleSelectChange('dietType')} value={preferences.dietType}>
              <SelectTrigger id="dietType">
                <SelectValue placeholder="Select a diet type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="omnivore">Omnivore</SelectItem>
                <SelectItem value="vegetarian">Vegetarian</SelectItem>
                <SelectItem value="vegan">Vegan</SelectItem>
                <SelectItem value="keto">Keto</SelectItem>
                <SelectItem value="paleo">Paleo</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="calories">Daily Calorie Goal</Label>
            <Slider
              id="calories"
              min={1200}
              max={4000}
              step={100}
              value={[preferences.calories]}
              onValueChange={handleSliderChange}
            />
            <div className="text-right text-sm text-muted-foreground">{preferences.calories} calories</div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="meals">Number of Meals per Day</Label>
            <Select onValueChange={handleSelectChange('meals')} value={preferences.meals}>
              <SelectTrigger id="meals">
                <SelectValue placeholder="Select number of meals" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3">3 meals</SelectItem>
                <SelectItem value="4">4 meals</SelectItem>
                <SelectItem value="5">5 meals</SelectItem>
                <SelectItem value="6">6 meals</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="allergies">Allergies or Restrictions</Label>
            <Input
              id="allergies"
              name="allergies"
              placeholder="e.g., nuts, dairy, gluten"
              value={preferences.allergies}
              onChange={handleInputChange}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={generateMealPlan} className="w-full">Generate Meal Plan</Button>
        </CardFooter>
        {mealPlan && (
          <CardContent>
            <h3 className="text-lg font-semibold mb-2">Your Personalized Meal Plan</h3>
            <div className="space-y-2">
              <p>{mealPlan}</p>
            </div>
          </CardContent>
        )}
      </Card>
    </>
  )
}