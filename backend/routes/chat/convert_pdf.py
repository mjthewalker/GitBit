import os
from fpdf import FPDF
import requests
from datetime import datetime, timedelta
from bs4 import BeautifulSoup
import json
import sys


def save_to_file(text, filename):
    """
    Save a string to a text file.

    :param text: The string to save
    :param filename: The filename to save as
    """
    with open(filename, 'w') as file:
        file.write(text)
def json_to_text(json_data):
    """
    Convert a JSON object or list to a text string with a newline between every key and value.

    :param json_data: A JSON object, list, or string
    :return: A formatted string
    """
    # Load the JSON data if it's in string format
    if isinstance(json_data, str):
        json_data = json.loads(json_data)

    def format_json(data, indent=0):
        lines = []
        if isinstance(data, list):
            for index, item in enumerate(data):
                lines.append(f'{"  " * indent}- Item {index + 1}:')
                lines.extend(format_json(item, indent + 1))
        elif isinstance(data, dict):
            for key, value in data.items():
                if isinstance(value, (dict, list)):
                    lines.append(f'{"  " * indent}{key}:')
                    lines.extend(format_json(value, indent + 1))
                else:
                    lines.append(f'{"  " * indent}{key}: {value}')
        else:
            lines.append(f'{"  " * indent}{data}')
        return lines

    return "\n".join(format_json(json_data))
def conv(stock):
# Your Finnhub API key
  api_key = "cu19n49r01qqr3sga4cgcu19n49r01qqr3sga4d0"

  # Stock symbol for which to fetch news
  stock_symbol = stock  # Replace with the desired stock ticker symbol

  # Define the date range (last 7 days as an example)
  today = datetime.now().strftime("%Y-%m-%d")
  seven_days_ago = (datetime.now() - timedelta(days=60)).strftime("%Y-%m-%d")
  api_key1 = "fe5374705amsh4f043e88f787b43p1474c5jsnd6fd2d2550e6"


# Yahoo Finance API endpoint
  url1 = f"https://yahoo-finance15.p.rapidapi.com/api/yahoo/qu/quote/{stock_symbol}"

# Headers for authentication
  headers1 = {
    "X-RapidAPI-Key": api_key1,
    "X-RapidAPI-Host": "yahoo-finance15.p.rapidapi.com"
  }

# Make the API request
  response = requests.get(url1, headers=headers1)
  xx=json_to_text(response.json())
  x=''
  x=x+xx+'\n'
  # API endpoint for stock-specific news
  url = f"https://finnhub.io/api/v1/company-news"

  # Query parameters
  params = {
      "symbol": stock_symbol,
      "from": seven_days_ago,
      "to": today,
      "token": api_key
  }

  # Make the API request
  response = requests.get(url, params=params)
  u=[]
  # Handle the response
  if response.status_code == 200:
      news_data = response.json()
      print(f"News for {stock_symbol.upper()}:")
      for article in news_data[:10]:  # Display up to 10 articles
          print(f"Title: {article['headline']}")
          print(f"Source: {article['source']}")
          print(f"Published Time: {article['datetime']}")
          print(f"URL: {article['url']}")
          u.append(article['url'])
          print("-" * 50)
  else:
      print(f"Error: {response.status_code}")
      print(response.text)

  def extract_article_text(url):
      """
      Extracts the main text content from an article URL.

      :param url: The URL of the article
      :return: Extracted text content
      """
      try:
          # Fetch the webpage content
          response = requests.get(url)
          response.raise_for_status()  # Raise an error for bad responses (4xx or 5xx)

          # Parse the content with BeautifulSoup
          soup = BeautifulSoup(response.text, 'html.parser')

          # Extract article text
          paragraphs = soup.find_all('p')  # Most articles' text is within <p> tags
          article_text = "\n".join([p.get_text() for p in paragraphs])

          return article_text.strip()

      except requests.exceptions.RequestException as e:
          return f"Error fetching the URL: {e}"
      except Exception as e:
          return f"An error occurred: {e}"
  i=0
  for url in u:
    x=x+'\n'+extract_article_text(url)
    print(extract_article_text(url))
    i=i+1
  save_to_file(x,'d.txt')
  # Function to sanitize the text (replace or remove problematic characters)
  def sanitize_text(text, encoding='latin-1'):
      # Try encoding the text to the specified encoding
      try:
          return text.encode(encoding, 'ignore').decode(encoding)
      except UnicodeEncodeError:
          return text.encode(encoding, 'replace').decode(encoding)

  # Function to convert multiple .txt files into a single PDF with page and character limits
  def txt_to_single_pdf(txt_directory, pdf_file, max_pages=50, max_characters=10000):
      # Create a PDF instance
      pdf = FPDF()
      pdf.set_auto_page_break(auto=True, margin=15)
      pdf.add_page()

      # Set font
      pdf.set_font("Arial", size=12)

      # Initialize counters
      total_characters = 0
      current_page_count = 1

      # Loop through all .txt files in the directory
      for filename in os.listdir(txt_directory):
          if filename.endswith(".txt"):
              txt_file_path = os.path.join(txt_directory, filename)

              # Open the .txt file
              with open(txt_file_path, 'r', encoding='utf-8') as file:
                  lines = file.readlines()
                  for line in lines:
                      sanitized_line = sanitize_text(line)  # Sanitize the line

                      # Check if adding this line exceeds the character or page limit
                      if total_characters + len(sanitized_line) > max_characters or current_page_count > max_pages:
                          print(f"Reached limit: {current_page_count} pages or {total_characters} characters.")
                          pdf.output(pdf_file)
                          return

                      pdf.multi_cell(0, 10, sanitized_line)  # Add sanitized line to PDF
                      total_characters += len(sanitized_line)

                  # Add a new page if needed
                  if current_page_count < max_pages:
                      pdf.add_page()
                      current_page_count += 1

      # Output the PDF
      pdf.output(pdf_file)

  # Directory where the .txt files are located
  txt_directory = "./"  # Replace with your directory path

  # Output PDF file
  pdf_file = "./output.pdf"  # Replace with your desired output PDF file path

  # Convert all text files into a single PDF with limits
  txt_to_single_pdf(txt_directory, pdf_file, max_pages=100, max_characters=200000)
  print(f"Conversion completed! All text files are combined into {pdf_file}")

def process_stocks():
    """
    Reads stock symbols from asset.json and processes each one using conv()
    """
    try:
        # Read stock symbols from asset.json
        asset_json_path = sys.argv[1]
        
        with open(asset_json_path, 'r') as file:
            stock_symbols = json.load(file)
        
        if not isinstance(stock_symbols, list):
            raise ValueError("asset.json should contain a list of stock symbols")
            
        # Process each stock symbol
        for symbol in stock_symbols:
            print(f"\nProcessing stock: {symbol}")
            try:
                conv(symbol)
                print(f"Successfully processed {symbol}")
            except Exception as e:
                print(f"Error processing {symbol}: {str(e)}")
                continue
            
    except FileNotFoundError:
        print("asset.json file not found")
    except json.JSONDecodeError:
        print("Error decoding asset.json - make sure it's valid JSON")
    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        
# conv("NVDA")
if __name__ == "__main__":
    process_stocks()