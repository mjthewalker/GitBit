import requests
from bs4 import BeautifulSoup
from urllib.parse import quote_plus
import json
import shutil

# Configuration
QUERY = "HPMV virus"

def search_articles(query=QUERY, num_results=20):
    dir_path = './downloaded_pages'
    try :
        shutil.rmtree(dir_path)
    except:
        pass
    
    """
    Search Hacker News articles. If no query is provided, returns latest articles.
    
    Args:
        query (str, optional): Search term to look for
        num_results (int): Maximum number of results to return
    """
    # Base URL and headers
    base_url = "https://news.ycombinator.com/"
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    
    try:
        if query:
            # Use HN's search functionality
            search_url = f"https://hn.algolia.com/api/v1/search?query={quote_plus(query)}&tags=story"
            response = requests.get(search_url, headers=headers, timeout=10)
            response.raise_for_status()
            
            # Parse JSON response from Algolia API
            search_results = response.json()
            articles = []
            
            for hit in search_results.get('hits', [])[:num_results]:
                article = {
                    'title': hit.get('title', ''),
                    'link': hit.get('url') or f"https://news.ycombinator.com/item?id={hit.get('objectID')}",
                    'points': hit.get('points', 0),
                    'comments': hit.get('num_comments', 0),
                    'date': hit.get('created_at', ''),
                    'author': hit.get('author', '')
                }
                articles.append(article)
                
        else:
            # Fetch latest articles from homepage
            response = requests.get(base_url, headers=headers, timeout=10)
            response.raise_for_status()
            
            # Parse HTML content
            soup = BeautifulSoup(response.content, 'html.parser')
            articles = []
            
            # Find relevant articles using current selectors
            titles = soup.select('span.titleline > a')
            
            for title in titles[:num_results]:
                article = {
                    'title': title.text.strip(),
                    'link': title['href']
                }
                articles.append(article)
    
    except requests.RequestException as e:
        print(f"Error fetching data: {e}")
        return []
    
    return articles

def save_articles_to_json(articles, filename='articles.json'):
    """
    Save articles to a JSON file.
    
    Args:
        articles (list): List of articles to save
        filename (str): Name of the file to save the articles to
    """
    try:
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(articles, f, indent=4)
        print(f"Saved {len(articles)} articles to '{filename}'.")
    except IOError as e:
        print(f"Error saving articles to {filename}: {e}")

def main():
    # Use the QUERY configuration variable
    articles = search_articles(QUERY if QUERY else None)
    
    if articles:
        save_articles_to_json(articles)  # Save the articles to a JSON file
        print(f"\n{'Search results' if QUERY else 'Top articles'} from Hacker News:")
        for i, article in enumerate(articles, 1):
            print(f"\n{i}. {article['title']}")
            print(f"   Link: {article['link']}")
            
            # Print additional info for search results
            if QUERY:
                print(f"   Points: {article['points']}")
                print(f"   Comments: {article['comments']}")
                print(f"   Author: {article['author']}")
                print(f"   Date: {article['date']}")
    else:
        print("No articles found.")

if __name__ == "__main__":
    main()
