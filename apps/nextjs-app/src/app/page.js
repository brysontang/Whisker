import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 text-gray-900">
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <header className="text-center mb-16">
          <h1 className="text-6xl font-bold mb-4">Whisker</h1>
          <p className="text-2xl text-gray-700">
            Recipes, reimagined and customized.
          </p>
        </header>

        <main className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="text-4xl font-bold">Transform Any Recipe</h2>
            <p className="text-xl text-gray-700">
              Whisker is your Chrome extension for recipe customization. Scrape
              recipes from any website and tailor them to your dietary needs and
              preferences.
            </p>
            <div className="space-y-4">
              <div className="flex items-center">
                <svg
                  className="w-6 h-6 text-amber-500 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-lg">Scrape recipes from any website</span>
              </div>
              <div className="flex items-center">
                <svg
                  className="w-6 h-6 text-amber-500 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-lg">
                  Customize recipes to fit your diet (vegan, keto, low-carb)
                </span>
              </div>
              <div className="flex items-center">
                <svg
                  className="w-6 h-6 text-amber-500 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-lg">
                  Save and organize your customized recipes
                </span>
              </div>
            </div>
            <Link
              href="/recipes"
              className="inline-block bg-amber-500 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-amber-600 transition duration-300"
            >
              Get Started
            </Link>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <h3 className="text-2xl font-bold mb-4">How It Works</h3>
            <ol className="list-decimal list-inside space-y-2">
              <li>Install the Whisker Chrome extension</li>
              <li>Find a recipe you like on any website</li>
              <li>Click the Whisker icon to scrape the recipe</li>
              <li>
                Add your custom instructions (e.g., &quot;make it vegan&quot;)
              </li>
              <li>Save your personalized recipe</li>
            </ol>
          </div>
        </main>

        <section className="mt-32 text-center">
          <h2 className="text-3xl font-bold mb-8">
            Customize Your Cooking Experience
          </h2>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            Whether you&apos;re looking to make a recipe vegan, keto-friendly,
            or simply want to add your own twist, Whisker gives you the power to
            transform any recipe to fit your lifestyle and preferences.
          </p>
        </section>
      </div>
    </div>
  );
}
