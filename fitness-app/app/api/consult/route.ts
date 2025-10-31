import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { age, weight, height, goal, activityLevel, dietaryPreferences, allergies, healthConditions, type } = body;

    // Calculate BMI
    const heightInMeters = parseFloat(height) / 100;
    const bmi = (parseFloat(weight) / (heightInMeters * heightInMeters)).toFixed(1);

    // Calculate BMR (Basal Metabolic Rate) using Mifflin-St Jeor Equation
    // For simplicity, using average formula
    const bmr = 10 * parseFloat(weight) + 6.25 * parseFloat(height) - 5 * parseFloat(age) + 5;

    // Activity multipliers
    const activityMultipliers: Record<string, number> = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      athlete: 1.9
    };

    const tdee = Math.round(bmr * (activityMultipliers[activityLevel] || 1.2));

    let advice = '';

    if (type === 'fitness') {
      advice = generateFitnessAdvice({ age, weight, height, bmi, goal, activityLevel, healthConditions, tdee });
    } else {
      advice = generateNutritionAdvice({ age, weight, height, bmi, goal, activityLevel, dietaryPreferences, allergies, healthConditions, tdee });
    }

    return NextResponse.json({ advice });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate consultation' }, { status: 500 });
  }
}

function generateFitnessAdvice(data: any): string {
  const { age, weight, height, bmi, goal, activityLevel, healthConditions, tdee } = data;

  let advice = `🏋️ PERSONALIZED FITNESS CONSULTATION\n\n`;
  advice += `📊 YOUR PROFILE\n`;
  advice += `Age: ${age} years | Weight: ${weight}kg | Height: ${height}cm\n`;
  advice += `BMI: ${bmi} | Daily Calorie Needs: ${tdee} kcal\n\n`;

  advice += `🎯 GOAL: ${goal.toUpperCase().replace('-', ' ')}\n\n`;

  // Workout recommendations based on goal
  advice += `💪 RECOMMENDED WORKOUT PLAN:\n\n`;

  switch (goal) {
    case 'weight-loss':
      advice += `Weekly Structure:\n`;
      advice += `• 4-5 days cardio (30-45 min moderate intensity)\n`;
      advice += `• 3 days strength training (full body circuits)\n`;
      advice += `• 2 days active recovery (walking, yoga)\n\n`;
      advice += `Key Exercises:\n`;
      advice += `• HIIT sessions (intervals of high/low intensity)\n`;
      advice += `• Compound movements (squats, lunges, push-ups)\n`;
      advice += `• Core strengthening exercises\n`;
      advice += `• Progressive cardio (running, cycling, swimming)\n\n`;
      advice += `Target: 500-750 calorie deficit per day\n`;
      advice += `Aim for 0.5-1kg weight loss per week\n`;
      break;

    case 'muscle-gain':
      advice += `Weekly Structure:\n`;
      advice += `• 4-5 days strength training (progressive overload)\n`;
      advice += `• 2-3 days light cardio (20 min for heart health)\n`;
      advice += `• 2 days complete rest\n\n`;
      advice += `Key Exercises:\n`;
      advice += `• Compound lifts (deadlifts, squats, bench press)\n`;
      advice += `• Progressive overload (increase weight weekly)\n`;
      advice += `• 8-12 reps per set, 3-4 sets per exercise\n`;
      advice += `• Focus on major muscle groups\n\n`;
      advice += `Target: 300-500 calorie surplus per day\n`;
      advice += `Aim for 0.25-0.5kg muscle gain per week\n`;
      break;

    case 'endurance':
      advice += `Weekly Structure:\n`;
      advice += `• 4-5 days aerobic training (45-60 min)\n`;
      advice += `• 2 days strength training (maintain muscle)\n`;
      advice += `• 1 day active recovery\n\n`;
      advice += `Key Exercises:\n`;
      advice += `• Long-distance running/cycling\n`;
      advice += `• Interval training for speed\n`;
      advice += `• Core strength exercises\n`;
      advice += `• Flexibility and mobility work\n\n`;
      advice += `Focus on gradually increasing distance/duration\n`;
      break;

    default:
      advice += `Weekly Structure:\n`;
      advice += `• 3-4 days moderate cardio (30 min)\n`;
      advice += `• 2-3 days strength training\n`;
      advice += `• 1-2 days rest or active recovery\n\n`;
      advice += `Key Exercises:\n`;
      advice += `• Mix of cardio and strength training\n`;
      advice += `• Bodyweight exercises (push-ups, squats)\n`;
      advice += `• Walking or jogging\n`;
      advice += `• Flexibility exercises\n`;
  }

  advice += `\n⚡ ADDITIONAL TIPS:\n`;
  advice += `• Warm up 5-10 min before workouts\n`;
  advice += `• Cool down and stretch after exercise\n`;
  advice += `• Stay hydrated (2-3L water daily)\n`;
  advice += `• Get 7-9 hours of sleep per night\n`;
  advice += `• Listen to your body and avoid overtraining\n`;

  if (healthConditions) {
    advice += `\n⚠️ HEALTH CONSIDERATIONS:\n`;
    advice += `You mentioned: ${healthConditions}\n`;
    advice += `Please consult with a healthcare provider before starting\n`;
    advice += `any new exercise program.\n`;
  }

  advice += `\n📈 PROGRESSION:\n`;
  advice += `• Week 1-2: Build foundation and proper form\n`;
  advice += `• Week 3-4: Increase intensity gradually\n`;
  advice += `• Week 5+: Maintain consistency and track progress\n`;

  return advice;
}

function generateNutritionAdvice(data: any): string {
  const { age, weight, height, bmi, goal, activityLevel, dietaryPreferences, allergies, healthConditions, tdee } = data;

  let advice = `🥗 PERSONALIZED NUTRITION CONSULTATION\n\n`;
  advice += `📊 YOUR PROFILE\n`;
  advice += `Age: ${age} years | Weight: ${weight}kg | Height: ${height}cm\n`;
  advice += `BMI: ${bmi} | Daily Calorie Needs: ${tdee} kcal\n\n`;

  advice += `🎯 GOAL: ${goal.toUpperCase().replace('-', ' ')}\n\n`;

  // Calorie recommendations based on goal
  let targetCalories = tdee;
  let proteinGrams = Math.round(parseFloat(weight) * 2.0);
  let fatGrams = Math.round((targetCalories * 0.25) / 9);
  let carbGrams = Math.round((targetCalories - (proteinGrams * 4) - (fatGrams * 9)) / 4);

  switch (goal) {
    case 'weight-loss':
      targetCalories = Math.round(tdee - 500);
      proteinGrams = Math.round(parseFloat(weight) * 2.2);
      fatGrams = Math.round((targetCalories * 0.25) / 9);
      carbGrams = Math.round((targetCalories - (proteinGrams * 4) - (fatGrams * 9)) / 4);
      break;
    case 'muscle-gain':
      targetCalories = Math.round(tdee + 400);
      proteinGrams = Math.round(parseFloat(weight) * 2.4);
      fatGrams = Math.round((targetCalories * 0.25) / 9);
      carbGrams = Math.round((targetCalories - (proteinGrams * 4) - (fatGrams * 9)) / 4);
      break;
  }

  advice += `🍽️ DAILY NUTRITION TARGETS:\n`;
  advice += `Calories: ${targetCalories} kcal\n`;
  advice += `Protein: ${proteinGrams}g (${Math.round(parseFloat(weight) * 2)}g per kg body weight)\n`;
  advice += `Carbohydrates: ${carbGrams}g\n`;
  advice += `Fats: ${fatGrams}g\n\n`;

  advice += `🍎 MEAL STRUCTURE:\n`;
  advice += `• Breakfast: ${Math.round(targetCalories * 0.25)} kcal\n`;
  advice += `• Lunch: ${Math.round(targetCalories * 0.35)} kcal\n`;
  advice += `• Dinner: ${Math.round(targetCalories * 0.30)} kcal\n`;
  advice += `• Snacks: ${Math.round(targetCalories * 0.10)} kcal\n\n`;

  advice += `🥙 RECOMMENDED FOODS:\n\n`;

  if (dietaryPreferences?.toLowerCase().includes('vegan') || dietaryPreferences?.toLowerCase().includes('vegetarian')) {
    advice += `Protein Sources:\n`;
    advice += `• Legumes (lentils, chickpeas, black beans)\n`;
    advice += `• Tofu and tempeh\n`;
    advice += `• Quinoa and other whole grains\n`;
    advice += `• Nuts and seeds\n`;
    if (!dietaryPreferences.toLowerCase().includes('vegan')) {
      advice += `• Greek yogurt and eggs\n`;
    }
  } else {
    advice += `Protein Sources:\n`;
    advice += `• Lean meats (chicken breast, turkey)\n`;
    advice += `• Fish (salmon, tuna, cod)\n`;
    advice += `• Eggs and egg whites\n`;
    advice += `• Greek yogurt and cottage cheese\n`;
    advice += `• Legumes and beans\n`;
  }

  advice += `\nHealthy Carbohydrates:\n`;
  advice += `• Oatmeal and whole grain bread\n`;
  advice += `• Brown rice and quinoa\n`;
  advice += `• Sweet potatoes\n`;
  advice += `• Fruits (berries, apples, bananas)\n`;
  advice += `• Vegetables (leafy greens, broccoli)\n\n`;

  advice += `Healthy Fats:\n`;
  advice += `• Avocados\n`;
  advice += `• Nuts (almonds, walnuts)\n`;
  advice += `• Olive oil and coconut oil\n`;
  advice += `• Fatty fish (salmon, mackerel)\n`;
  advice += `• Chia and flax seeds\n\n`;

  if (allergies) {
    advice += `⚠️ ALLERGIES TO AVOID:\n`;
    advice += `${allergies}\n`;
    advice += `Make sure to read labels and find suitable alternatives\n\n`;
  }

  advice += `💧 HYDRATION:\n`;
  advice += `• Drink at least 2-3 liters of water daily\n`;
  advice += `• More if exercising or in hot weather\n`;
  advice += `• Limit sugary drinks and alcohol\n\n`;

  advice += `⚡ TIMING TIPS:\n`;
  advice += `• Eat protein within 2 hours post-workout\n`;
  advice += `• Don't skip breakfast to boost metabolism\n`;
  advice += `• Eat smaller, frequent meals for stable energy\n`;
  advice += `• Avoid heavy meals 2-3 hours before bed\n\n`;

  advice += `🚫 FOODS TO LIMIT:\n`;
  advice += `• Processed foods and refined sugars\n`;
  advice += `• Trans fats and excessive saturated fats\n`;
  advice += `• High-sodium foods\n`;
  advice += `• Excessive caffeine and alcohol\n\n`;

  advice += `📋 SAMPLE MEAL IDEAS:\n\n`;
  advice += `Breakfast:\n`;
  advice += `• Oatmeal with berries and protein powder\n`;
  advice += `• Greek yogurt with granola and fruit\n`;
  advice += `• Whole grain toast with avocado and eggs\n\n`;

  advice += `Lunch:\n`;
  advice += `• Grilled chicken salad with olive oil dressing\n`;
  advice += `• Quinoa bowl with vegetables and chickpeas\n`;
  advice += `• Whole grain wrap with lean protein and veggies\n\n`;

  advice += `Dinner:\n`;
  advice += `• Baked salmon with sweet potato and broccoli\n`;
  advice += `• Stir-fry with lean protein and brown rice\n`;
  advice += `• Grilled chicken with quinoa and mixed vegetables\n\n`;

  if (healthConditions) {
    advice += `⚠️ HEALTH CONSIDERATIONS:\n`;
    advice += `You mentioned: ${healthConditions}\n`;
    advice += `Please consult with a registered dietitian or doctor\n`;
    advice += `for personalized medical nutrition therapy.\n`;
  }

  return advice;
}
