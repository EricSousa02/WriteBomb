import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

import { Input } from "@/components/ui";
import useDebounce from "@/hooks/useDebounce";
import { GridPostList, Loader } from "@/components/shared";
import { useGetPosts, useSearchPosts } from "@/lib/react-query/queries";
import { useUserContext } from "@/context/AuthContext";

export type SearchResultProps = {
  isSearchFetching: boolean;
  searchedPosts: any;
};

const SearchResults = ({ isSearchFetching, searchedPosts }: SearchResultProps) => {
  const { t } = useUserContext();

  if (isSearchFetching) {
    return <Loader />;
  } else if (searchedPosts && searchedPosts.documents.length > 0) {
    return <GridPostList posts={searchedPosts.documents} />;
  } else {
    return (
      <p className="text-light-4 mt-10 text-center w-full">{t("No results found")}</p>
    );
  }
};

const Explore = () => {
  const { ref, inView } = useInView();
  const [selectedFilter, setSelectedFilter] = useState("Default");
  const { data: posts, fetchNextPage, hasNextPage } = useGetPosts();

  const [searchValue, setSearchValue] = useState("");
  const debouncedSearch = useDebounce(searchValue, 500);
  const { data: searchedPosts, isFetching: isSearchFetching } = useSearchPosts(debouncedSearch);

  const { t } = useUserContext();

  useEffect(() => {
    if (inView && !searchValue) {
      fetchNextPage();
    }
  }, [inView, searchValue]);

  if (!posts)
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );

  let allPosts: any[] = [];

  posts.pages.forEach((item) => {
    allPosts = [...allPosts, ...item.documents];
  });

  let renderedPosts;

  if (selectedFilter === "inverted") {
    renderedPosts = (
      <GridPostList key={`inverted-posts`} posts={allPosts.slice().reverse()} />
    );
  } else {
    renderedPosts = (
      <GridPostList key={`normal-posts`} posts={allPosts} />
    );
  }

  const shouldShowSearchResults = searchValue !== "";
  const shouldShowPosts = !shouldShowSearchResults &&
    posts.pages.every((item) => item.documents.length === 0);

  return (
    <div className="explore-container">
      <div className="explore-inner_container">
        <div className="flex gap-2 w-full max-w-5xl">
          <img
            src="/assets/icons/wallpaper.svg"
            width={36}
            height={36}
            alt="edit"
          />
          <h2 className="h3-bold md:h2-bold w-full">{t("Search Posts")}</h2>
        </div>
        <div className="flex gap-1 px-4 w-full rounded-lg bg-dark-4">
          <img
            src="/assets/icons/search.svg"
            width={24}
            height={24}
            alt="search"
          />
          <Input
            type="text"
            placeholder={t("Search")}
            className="explore-search"
            value={searchValue}
            onChange={(e) => {
              const { value } = e.target;
              setSearchValue(value);
            }}
          />
        </div>
      </div>

      <div className="flex-between w-full max-w-5xl mt-16 mb-7">
        <h3 className="body-bold md:h3-bold">{t("Popular Today")}</h3>

        <select
          value={selectedFilter}
          onChange={(e) => setSelectedFilter(e.target.value)}
          className="select text-light-2 bg-dark-3 border-r-[4px] border-dark-3 rounded-md px-5 py-2 pr-7 cursor-pointer appearance-none focus:outline-none"
        >
          <option value="Default">
            {t("Default")}
          </option>
          <option value="inverted">
            {t("Desc")}
          </option>
        </select>
      </div>

      <div className="flex flex-wrap gap-9 w-full max-w-5xl">
        {shouldShowSearchResults ? (
          <SearchResults
            isSearchFetching={isSearchFetching}
            searchedPosts={searchedPosts}
          />
        ) : shouldShowPosts ? (
          <p className="text-light-4 mt-10 text-center w-full">{t("End of posts")}</p>
        ) : (
          renderedPosts
        )}
      </div>

      {hasNextPage && !searchValue && (
        <div ref={ref} className="mt-10">
          <Loader />
        </div>
      )}
    </div>
  );
};

export default Explore;
