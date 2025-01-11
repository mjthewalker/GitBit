import os
from fpdf import FPDF

# Function to sanitize the text (replace or remove problematic characters)
def sanitize_text(text, encoding='latin-1'):
    # Try encoding the text to the specified encoding
    try:
        return text.encode(encoding, 'ignore').decode(encoding)
    except UnicodeEncodeError:
        return text.encode(encoding, 'replace').decode(encoding)

# Function to convert multiple .txt files into a single PDF
def txt_to_single_pdf(txt_directory, pdf_file):
    # Create a PDF instance
    pdf = FPDF()
    pdf.set_auto_page_break(auto=True, margin=15)
    pdf.add_page()

    # Set font
    pdf.set_font("Arial", size=12)

    # Loop through all .txt files in the directory
    for filename in os.listdir(txt_directory):
        if filename.endswith(".txt"):
            txt_file_path = os.path.join(txt_directory, filename)
            
            # Open the .txt file
            with open(txt_file_path, 'r', encoding='utf-8') as file:
                lines = file.readlines()
                for line in lines:
                    sanitized_line = sanitize_text(line)  # Sanitize the line
                    pdf.multi_cell(0, 10, sanitized_line)  # Add sanitized line to PDF
            
            # Add a new line after each text file's content
            pdf.ln(10)  # Adjust the value to increase/decrease the space between files

    # Output the PDF
    pdf.output(pdf_file)

# Directory where the .txt files are located
txt_directory = "./downloaded_pages"  # Replace with your directory path

# Output PDF file
pdf_file = "./ml-integration/pdf/output.pdf"  # Replace with your desired output PDF file path

# Convert all text files into a single PDF
txt_to_single_pdf(txt_directory, pdf_file)
print(f"Conversion completed! All text files are combined into {pdf_file}")
