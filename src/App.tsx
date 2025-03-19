
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RepoList } from './components/RepoList'

const queryClient = new QueryClient()

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="container mx-auto flex flex-col justify-center items-center space-y-4 min-h-screen p-4">
        <h1 className="text-2xl font-bold">Github Repo Search</h1>
        <RepoList />
      </div>
    </QueryClientProvider>
  )
}

export default App
