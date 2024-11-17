export function getPopularPosts(posts, analytics) {
  const filteredPosts = posts.filter((post) =>
    analytics.some((p) => p.page.includes(post.url))
  );

  const sortedPosts = filteredPosts.sort((a, b) => {
    const visitors = (page) =>
      analytics.find((p) => p.page.includes(page.url))?.visitors || 0;
    return visitors(b) - visitors(a);
  });

  return sortedPosts;
}
