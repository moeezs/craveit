# CraveIt - Beautiful Recipe Display App

Transform any AllRecipes.com URL into a beautiful, organized recipe display with CraveIt! This Next.js application fetches recipe data and presents it in a clean, modern interface.

## ✨ Features

- **Beautiful UI**: Modern design using shadcn/ui components and Tailwind CSS
- **Recipe Fetching**: Seamlessly extract recipe data from AllRecipes.com URLs
- **Organized Display**: Clean layout with ingredients, instructions, and nutrition info
- **Responsive Design**: Works perfectly on desktop and mobile devices
- **Loading States**: Elegant skeleton loading animations
- **Error Handling**: User-friendly error messages and validation
- **TypeScript**: Full type safety throughout the application

## 🚀 Tech Stack

- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **shadcn/ui** components for beautiful UI elements
- **Lucide React** for icons
- **AllRecipes API** for fetching recipe data

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd craveit
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📖 How to Use

1. **Find a Recipe**: Go to AllRecipes.com and find any recipe you like
2. **Copy the URL**: Copy the complete URL from your browser
3. **Paste & Fetch**: Paste the URL into CraveIt and click "Get Recipe"
4. **Enjoy**: View your beautifully formatted recipe with organized ingredients, step-by-step instructions, and nutrition information

### Example URLs to Try

- https://www.allrecipes.com/recipe/238654/brookies-brownie-cookies/
- https://www.allrecipes.com/recipe/213742/cheesy-chicken-broccoli-casserole/
- https://www.allrecipes.com/recipe/16354/easy-meatloaf/

## 🎨 Features in Detail

### Recipe Display
- **Header**: Recipe title with prep time, cook time, total time, and servings
- **Nutrition Badges**: Calories, fat, carbs, and protein information
- **Ingredients**: Organized by sections (if applicable) with bullet points
- **Instructions**: Step-by-step guide with numbering and optional images
- **Responsive Layout**: Two-column layout on desktop, single column on mobile

### User Experience
- **URL Validation**: Ensures only AllRecipes.com URLs are accepted
- **Loading Animation**: Beautiful skeleton placeholders while fetching
- **Error Handling**: Clear error messages for various failure scenarios
- **Rate Limiting**: Respects API rate limits with user-friendly messages

## 🔧 API Information

This app uses the AllRecipes API hosted at:
```
https://recipes-api-production-6853.up.railway.app
```

**Rate Limits**: 5 requests per minute per IP address

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/
│   ├── recipe-display.tsx # Main recipe display component
│   └── ui/                # shadcn/ui components
├── lib/
│   ├── recipe-api.ts      # API functions
│   └── utils.ts           # Utility functions
└── types/
    └── recipe.ts          # TypeScript interfaces
```

## 🎯 Future Enhancements

- [ ] Recipe search functionality
- [ ] Save favorite recipes
- [ ] Print-friendly recipe format
- [ ] Recipe scaling (adjust serving sizes)
- [ ] Dark mode toggle
- [ ] Recipe sharing capabilities
- [ ] Support for additional recipe websites

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
