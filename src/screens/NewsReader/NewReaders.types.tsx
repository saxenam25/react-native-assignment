// TypeScript interfaces based on newObject structure
export interface NewsSource {
    id: string | null;
    name: string;
}

export interface NewsArticleType {
    source: NewsSource;
    author: string;
    title: string;
    description: string;
    url: string;
    urlToImage: string;
    publishedAt: string;
    content: string;
}

export interface NewsArticleProps {
    article: NewsArticleType;
}

export interface NewsApiResponse {
    status: string;
    totalResults: number;
    articles: NewsArticleType[];
}