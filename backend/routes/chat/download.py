import json
import requests
import os
from bs4 import BeautifulSoup

def extract_main_content(html):
    """
    Extract main content and return cleaned text.
    """
    soup = BeautifulSoup(html, 'html.parser')
    
    # Try different tags to find the main content
    main_content = soup.find('main') or soup.find('article') or soup.find('div', class_='content')
    
    if main_content:
        # Remove unwanted tags (scripts, styles)
        for script_or_style in main_content(['script', 'style']):
            script_or_style.decompose()
        
        # Extract and clean text
        return main_content.get_text(separator=' ', strip=True)
    return ""  # Return empty if no content found

def download_page(url, filename):
    try:
        # Request with headers to avoid blocking
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        
        # Fetch the page and extract main content
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        main_content = extract_main_content(response.text)
        
        if main_content:
            # Save text content to file
            with open(filename, 'w', encoding='utf-8') as f:
                f.write(main_content)
            print(f"Downloaded content from {url} -> {filename}")
        else:
            print(f"No content found for {url}")
    
    except requests.RequestException as e:
        print(f"Error downloading {url}: {e}")

def download_articles(json_file='articles.json'):
    try:
        # Load articles from JSON
        with open(json_file, 'r', encoding='utf-8') as f:
            articles = json.load(f)
        
        # Create directory for saved pages
        os.makedirs('downloaded_pages', exist_ok=True)
        
        # Download each article
        for article in articles:
            title = article['title']
            link = article['link']
            filename = os.path.join('downloaded_pages', f"{title[:50]}.txt")  # Truncate title for filename
            download_page(link, filename)
    
    except FileNotFoundError:
        print(f"Error: {json_file} not found.")
    except json.JSONDecodeError:
        print(f"Error: Failed to parse JSON data in {json_file}.")

if __name__ == "__main__":
    download_articles()
