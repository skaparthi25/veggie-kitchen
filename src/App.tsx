
import { useState } from 'react'
import './App.css'

type Recipe = {
  id: number
  name: string
  time: number
  category: string
  ingredients: string[]
  instructions: string[]
}

const recipes: Recipe[] = [
  {
    id: 1,
    name: 'Paneer Butter Masala',
    time: 30,
    category: 'Indian',
    ingredients: [
      '200g paneer', '3 tomatoes', '1 onion',
      '2 tbsp cream', '1 tbsp butter',
      'Ginger garlic paste', 'Garam masala',
      'Salt and chilli powder',
    ],
    instructions: [
      'Chop the tomatoes and onion.',
      'Heat butter and sauté the onion.',
      'Add ginger garlic paste and tomatoes.',
      'Cook until the tomatoes soften.',
      'Blend the mixture into a smooth gravy.',
      'Add spices, paneer cubes and cream.',
      'Simmer for 5 minutes and serve.',
    ],
  },
  {
    id: 2,
    name: 'Vegetable Fried Rice',
    time: 20,
    category: 'Indo-Chinese',
    ingredients: [
      '2 cups cooked rice', '1 carrot',
      '1/2 cup beans', '1 capsicum',
      '2 tbsp soy sauce', '1 tbsp oil',
      'Salt and pepper',
    ],
    instructions: [
      'Cook rice and let it cool.',
      'Chop all vegetables into small pieces.',
      'Heat oil in a large pan.',
      'Stir-fry vegetables until tender-crisp.',
      'Add soy sauce and pepper.',
      'Add cooked rice and mix well.',
      'Serve hot.',
    ],
  },
  {
    id: 3,
    name: 'Pesarattu',
    time: 25,
    category: 'South Indian',
    ingredients: [
      '1 cup green moong dal', '1 inch ginger',
      '2 green chillies', '1 tsp cumin seeds',
      'Salt', 'Water as needed', 'Oil',
    ],
    instructions: [
      'Soak moong dal for 4–6 hours.',
      'Drain and blend with ginger, chillies and cumin.',
      'Add water gradually to make dosa batter.',
      'Heat a dosa pan.',
      'Spread batter into a thin circle.',
      'Drizzle oil and cook until crisp.',
      'Serve with chutney.',
    ],
  },
  {
    id: 4,
    name: 'Chickpea Salad',
    time: 15,
    category: 'Healthy',
    ingredients: [
      '1 cup cooked chickpeas', '1 cucumber',
      '1 tomato', '1/2 onion',
      '1 tbsp lemon juice', 'Fresh coriander',
      'Salt and pepper',
    ],
    instructions: [
      'Drain and rinse cooked chickpeas.',
      'Dice cucumber, tomato and onion.',
      'Combine everything in a bowl.',
      'Add lemon juice, salt and pepper.',
      'Mix well and garnish with coriander.',
      'Serve fresh.',
    ],
  },
]

function App() {
  const [search, setSearch] = useState('')
  const [selectedRecipe, setSelectedRecipe] =
    useState<Recipe | null>(null)

  const [favorites, setFavorites] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('veggie-favorites')
      const parsed: unknown = saved ? JSON.parse(saved) : []
      return Array.isArray(parsed)
        ? parsed.filter((id): id is number =>
            typeof id === 'number' &&
            recipes.some((recipe) => recipe.id === id)
          )
        : []
    } catch {
      return []
    }
  })

  const [showFavorites, setShowFavorites] = useState(false)

  const toggleFavorite = (id: number) => {
    setFavorites((previous) => {
      const updated = previous.includes(id)
        ? previous.filter((favoriteId) => favoriteId !== id)
        : [...previous, id]

      try {
        localStorage.setItem(
          'veggie-favorites',
          JSON.stringify(updated)
        )
      } catch {
        // Favorites still work for the current session.
      }

      return updated
    })
  }

  const filteredRecipes = recipes.filter((recipe) => {
    const matchesSearch =
      `${recipe.name} ${recipe.ingredients.join(' ')}`
        .toLowerCase()
        .includes(search.toLowerCase())

    const matchesFavorites =
      !showFavorites || favorites.includes(recipe.id)

    return matchesSearch && matchesFavorites
  })

  return (
    <main className="app">
      <header className="header">
        <span className="logo">🥬</span>
        <h1>Sripada's Kitchen</h1>
        <p>Delicious vegetarian recipes for everyone</p>
      </header>

      <section className="content">
        {selectedRecipe ? (
          <div className="recipe-details">
            <button
              className="back-button"
              onClick={() => setSelectedRecipe(null)}
            >
              ← Back to Recipes
            </button>

            <h2>{selectedRecipe.name}</h2>

            <button
              className="favorite-button"
              onClick={() => toggleFavorite(selectedRecipe.id)}
            >
              {favorites.includes(selectedRecipe.id)
                ? '❤️ Remove from Favorites'
                : '🤍 Add to Favorites'}
            </button>

            <p>⏱ {selectedRecipe.time} minutes</p>

            <span className="category">
              {selectedRecipe.category}
            </span>

            <h3>🥕 Ingredients</h3>
            <ul>
              {selectedRecipe.ingredients.map((ingredient) => (
                <li key={ingredient}>{ingredient}</li>
              ))}
            </ul>

            <h3>👨‍🍳 Cooking Instructions</h3>
            <ol>
              {selectedRecipe.instructions.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
          </div>
        ) : (
          <>
            <h2>What would you like to cook today?</h2>

            <div className="filter-buttons">
              <button
                className={!showFavorites ? 'filter-active' : ''}
                onClick={() => setShowFavorites(false)}
              >
                All Recipes
              </button>

              <button
                className={showFavorites ? 'filter-active' : ''}
                onClick={() => setShowFavorites(true)}
              >
                ❤️ Favorites ({favorites.length})
              </button>
            </div>

            <input
              className="search"
              type="search"
              placeholder="Search recipes or ingredients..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />

            <div className="recipe-grid">
              {filteredRecipes.map((recipe) => (
                <button
                  className="recipe-card recipe-button"
                  key={recipe.id}
                  onClick={() => setSelectedRecipe(recipe)}
                >
                  <div className="recipe-emoji">🥗</div>

                  <span className="favorite-indicator">
                    {favorites.includes(recipe.id)
                      ? '❤️ Saved'
                      : '🤍'}
                  </span>

                  <div className="recipe-info">
                    <span className="category">
                      {recipe.category}
                    </span>
                    <h3>{recipe.name}</h3>
                    <p>⏱ {recipe.time} minutes</p>
                    <p>{recipe.ingredients.join(', ')}</p>
                  </div>
                </button>
              ))}
            </div>

            {filteredRecipes.length === 0 && (
              <p>No recipes found. Try another search or filter.</p>
            )}
          </>
        )}
      </section>
    </main>
  )
}

export default App
