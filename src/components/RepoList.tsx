import { useInfiniteQuery } from "@tanstack/react-query";
import { Inbox, Loader2, Search, Star, X } from "lucide-react";
import { octokit } from "../lib/config";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Input } from "./ui/input";
import { useEffect, useState } from "react";
import { SkeletonLoading } from "./SkeletonLoading";
import { Button } from "./ui/button";

const fetchUsers = async (username: string, page: number) => {
  try {
    const usersReq = await octokit.rest.search.users({
      q: username,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      },
      per_page: 5,
      page: page
    });
  
    const users = usersReq.data.items;
  
    // Fetch repositories for each user
    const userRepos = users.map(async (user) => {
      const reposResponse = await octokit.rest.repos.listForUser({
        username: user.login,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28'
        },
        per_page: 5,
      });
  
      return {
        username: user.login,
        profile_url: user.html_url,
        avatar_url: user.avatar_url,
        repositories: reposResponse.data.map(repo => ({
          name: repo.name,
          url: repo.html_url,
          description: repo.description,
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          issues: repo.open_issues_count
        }))
      };
    });
  
    const usersWithRepos = await Promise.all(userRepos);
      
    return usersWithRepos;
  } catch (error) {
    console.error("Error fetching data:", error);
  }

}

export const RepoList = () => {

  const [debouncedUsername, setDebouncedUsername] = useState('');
  const [searchValue, setSearchValue] = useState('');

  const {  
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['users', debouncedUsername],
    queryFn: ({ pageParam = 1 }) => fetchUsers(debouncedUsername, pageParam),
    enabled: !!debouncedUsername,
    getNextPageParam: (lastPage, pages) => {
      return lastPage && lastPage.length > 0 ? pages.length + 1 : undefined;
    },
    initialPageParam: 1
  })

  const debounce = (func: (...args: any[]) => void, delay: number) => {
    let timer: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };

  const onChangeUsername = debounce((username: string) => {
    setDebouncedUsername(username);
  }, 500);

  useEffect(() => {
    if (!searchValue) {
      setDebouncedUsername('');
      return;
    }

    onChangeUsername(searchValue);
  }, [searchValue]);

  return (
    <Card className="max-w-lg h-full mx-auto w-full">
      <CardHeader>
        <div className="relative">
          <Input className="w-full" type="text" placeholder="Search username" value={searchValue} onChange={(e) => setSearchValue(e.target.value)} />
          {
            searchValue && (
              <button className="absolute right-3 top-3 cursor-pointer" onClick={() => setSearchValue('')}> <X className="size-4 text-red-500" /> </button>
            )
          }
        </div>
        {
          searchValue && (
            <p className="text-sm text-muted-foreground">Showing results for: {searchValue}</p>
          )
        }

      </CardHeader>
      <CardContent>
        {isLoading ? (
          <SkeletonLoading />
        ) : (
          <Accordion type="single" collapsible className="w-full space-y-1">
            {data?.pages.map((page) => page?.map((item) => (
              <AccordionItem key={item.username} value={item.username}>
                <AccordionTrigger className="cursor-pointer">{item.username}</AccordionTrigger>
                <AccordionContent className="space-y-2">
                  {item.repositories.map((repo) => (
                    <Card key={repo.name} className="shadow-none">
                      <CardContent>
                        <div className="flex justify-between"> 
                          <p className="font-medium">{repo.name}</p>
                          <div className="flex items-center gap-1">
                            <p>{repo.stars}</p>
                            <Star className="size-4" />
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{repo.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </AccordionContent>
              </AccordionItem>
            )))}
          </Accordion>
        )}
        
        {hasNextPage && (
          <div className="flex justify-center mt-4">
            {isFetchingNextPage ? (
              <Button className="w-full bg-[#f6f8fa] hover:bg-[#f6f8fa] text-[#24292e] border border-[#e1e4e8] hover:border-[#e1e4e8]" disabled>
                <Loader2 className="size-4 animate-spin" />
              </Button>
            ) : (
              <Button className="w-full cursor-pointer bg-[#f6f8fa] hover:bg-[#f6f8fa] text-[#24292e] border border-[#e1e4e8] hover:border-[#e1e4e8]" onClick={() => fetchNextPage()}>Load more</Button>
            )}
          </div>
        )}

        {
          (!data && debouncedUsername === '') && (
            <div className="flex flex-col justify-center items-center min-h-[50vh]">
              <Search className="size-10 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Start typing to search for users</p>
            </div>
          )
        }

        {data?.pages.length === 0 && (
          <div className="flex flex-col justify-center items-center min-h-[50vh]">
            <Inbox className="size-10 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">No results found</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}