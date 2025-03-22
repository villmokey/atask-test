# GitHub User Finder

## Application Specification

This application is a GitHub user finder that allows users to search for GitHub accounts and view their repositories. Key features include:

- Search for GitHub users by username
- Display a list of users matching the search criteria
- Show top repositories for each user
- Repository details including name, description, and star count
- Responsive and user-friendly interface
- Pagination to load more search results
- GitHub-inspired design

The application is built using:
- React.js for the user interface
- TypeScript for type-safety
- Tanstack Query (React Query) for data and state management
- Octokit for GitHub API access
- Lucide React for icons
- Tailwind CSS for styling

## How to Run the Application

### Prerequisites
- Node.js (version 16 or newer)
- npm or yarn

### Installation Steps

1. Clone the repository
```bash
git clone https://github.com/username/github-user-finder.git
cd github-user-finder
```

2. Install dependencies
```bash
npm install
# or using yarn
yarn install
```

3. Create a .env file in the project root and add your GitHub Personal Access Token:

```
VITE_GITHUB_TOKEN=your_github_personal_access_token
```

4. Run the application in development mode
```bash
npm run dev
# or using yarn
yarn dev
```

5. Open your browser and navigate to `http://localhost:5173` (or another port shown in the terminal)

### Building for Production

To create a production build:
```bash
npm run build
# or using yarn
yarn build
```

The build output will be available in the `dist/` folder and ready to deploy to your hosting of choice.
