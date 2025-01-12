import os
from fpdf import FPDF
import requests
from datetime import datetime, timedelta
from bs4 import BeautifulSoup
import json
import sys

def json_to_text(json_data):
    """
    Convert a JSON object or list to a text string with a newline between every key and value.
    """
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


def fetch_stock_data(stock_symbol):
    """
    Fetches stock data and news for a given stock symbol and returns formatted text.
    """
    api_key = "cu19n49r01qqr3sga4cgcu19n49r01qqr3sga4d0"  # Finnhub API key
    api_key1 = "fe5374705amsh4f043e88f787b43p1474c5jsnd6fd2d2550e6"  # Yahoo Finance API key

    today = datetime.now().strftime("%Y-%m-%d")
    seven_days_ago = (datetime.now() - timedelta(days=60)).strftime("%Y-%m-%d")

    # Fetch Yahoo Finance data
    url1 = f"https://yahoo-finance15.p.rapidapi.com/api/yahoo/qu/quote/{stock_symbol}"
    headers1 = {
        "X-RapidAPI-Key": api_key1,
        "X-RapidAPI-Host": "yahoo-finance15.p.rapidapi.com"
    }
    yahoo_response = requests.get(url1, headers=headers1)
    stock_info = json_to_text(yahoo_response.json())

    # Fetch stock news
    url = f"https://finnhub.io/api/v1/company-news"
    params = {
        "symbol": stock_symbol,
        "from": seven_days_ago,
        "to": today,
        "token": api_key
    }
    news_response = requests.get(url, params=params)
    news_data = news_response.json() if news_response.status_code == 200 else []
    news_text = ""
    for article in news_data[:5]:  # Limit to 5 articles
        news_text += (
            f"Title: {article['headline']}\n"
            f"Source: {article['source']}\n"
            f"Published: {datetime.utcfromtimestamp(article['datetime']).strftime('%Y-%m-%d %H:%M:%S')}\n"
            f"URL: {article['url']}\n\n"
        )

    return f"--- {stock_symbol.upper()} ---\n\nStock Info:\n{stock_info}\n\nNews:\n{news_text}"


def create_combined_pdf(stock_symbols, output_pdf):
    """
    Generate a combined PDF for all stock symbols.
    """
    pdf = FPDF()
    pdf.set_auto_page_break(auto=True, margin=15)
    pdf.add_page()
    pdf.set_font("Arial", size=12)

    for symbol in stock_symbols:
        try:
            stock_data = fetch_stock_data(symbol)
            pdf.set_font("Arial", "B", size=14)
            pdf.cell(0, 10, f"Stock: {symbol}", ln=True)
            pdf.set_font("Arial", size=12)
            pdf.multi_cell(0, 10, stock_data)
            pdf.ln(10)  # Add spacing between stocks
        except Exception as e:
            pdf.set_font("Arial", "B", size=12)
            pdf.cell(0, 10, f"Error fetching data for {symbol}: {str(e)}", ln=True)
            pdf.ln(10)

    pdf.output(output_pdf)
    print(f"PDF generated: {output_pdf}")


def process_stocks():
    """
    Reads stock symbols from asset.json and generates a PDF.
    """
    try:
        # Read stock symbols from asset.json
        asset_json_path = sys.argv[1] if len(sys.argv) > 1 else "asset.json"
        output_pdf_path = sys.argv[2] if len(sys.argv) > 2 else "output.pdf"

        with open(asset_json_path, 'r') as file:
            stock_symbols = json.load(file)

        if not isinstance(stock_symbols, list):
            raise ValueError("asset.json should contain a list of stock symbols")

        create_combined_pdf(stock_symbols, output_pdf_path)

    except FileNotFoundError:
        print("asset.json file not found")
    except json.JSONDecodeError:
        print("Error decoding asset.json - make sure it's valid JSON")
    except Exception as e:
        print(f"Unexpected error: {str(e)}")


if __name__ == "__main__":
    process_stocks()