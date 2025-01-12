import os
import json
from groclake.cataloglake import CatalogLake
from groclake.vectorlake import VectorLake
from groclake.datalake import DataLake
from groclake.modellake import ModelLake
import sys


link = sys.argv[1]  # First argument after script path
user_query = sys.argv[2]  # Second argument after script path

# Environment variable setup
GROCLAKE_API_KEY = '35f4a8d465e6e1edc05f3d8ab658c551'
GROCLAKE_ACCOUNT_ID = 'b37a323283e59c84e5f47ae739751357'

os.environ['GROCLAKE_API_KEY'] = GROCLAKE_API_KEY
os.environ['GROCLAKE_ACCOUNT_ID'] = GROCLAKE_ACCOUNT_ID
    

def initialize(link):
    
    if(os.path.exists(os.path.join(os.path.dirname(__file__), 'initialization_state.json'))):
        with open(os.path.join(os.path.dirname(__file__), 'initialization_state.json'), 'r') as file:
            state = json.load(file)
            vectorlake_instance = VectorLake()  # Create instance for usage
            vectorlake_instance.vectorlake_id = state.get('vectorlake_id')
            return vectorlake_instance, state.get('vectorlake_id'), state.get('datalake_id')
    else:
        print("No state file found. Initializing from scratch.")
        
    # Environment variable setup
    GROCLAKE_API_KEY = '35f4a8d465e6e1edc05f3d8ab658c551'
    GROCLAKE_ACCOUNT_ID = 'b37a323283e59c84e5f47ae739751357'

    os.environ['GROCLAKE_API_KEY'] = GROCLAKE_API_KEY
    os.environ['GROCLAKE_ACCOUNT_ID'] = GROCLAKE_ACCOUNT_ID

    # Initialize Groclake catalog instance
    catalog = CatalogLake()

    try:
        vectorlake = VectorLake()
        vector_create = vectorlake.create()
        vectorlake_id = vector_create['vectorlake_id']
        print(f"VectorLake ID: {vectorlake_id}")
        
        datalake = DataLake()
        datalake_create = datalake.create()
        datalake_id = datalake_create['datalake_id']
        print(f"DataLake ID: {datalake_id}")
    except Exception as e:
        print(f"Error during initialization: {e}")
        return None

    try:
        # Push the document URL to the DataLake
        payload_push = {
            "datalake_id": datalake_id,
            "document_type": "url",
            "document_data": link
        }
        data_push = datalake.push(payload_push)
        document_id = data_push.get("document_id")
        print(f"Document ID: {document_id}")
    except Exception as e:
        print(f"Error during document push: {e}")
        return None

    try:
        # Fetch the document chunks
        payload_fetch = {
            "datalake_id": datalake_id,
            "document_id": document_id,
            "fetch_format": "chunk",
            "chunk_size": "500"
        }
        data_fetch = datalake.fetch(payload_fetch)
        document_chunks = data_fetch.get("document_data", [])
        print(f"Fetched {len(document_chunks)} chunks.")
    except Exception as e:
        print(f"Error during document fetch: {e}")
        return None

    try:
        # Generate vectors for each chunk and push them to VectorLake
        for idx, chunk in enumerate(document_chunks):
            vector_doc = vectorlake.generate(chunk)
            vector_chunk = vector_doc.get("vector")
            vectorlake_push_payload = {
                "vector": vector_chunk,
                "vectorlake_id": vectorlake_id,
                "document_text": chunk,
                "vector_type": "text",
                "metadata": {}
            }
            push_response = vectorlake.push(vectorlake_push_payload)
            print(f"Pushed vector for chunk {idx + 1}.")
    except Exception as e:
        print(f"Error during vector push: {e}")
        return None

    # Save the state to a JSON file
    state = {
        "vectorlake_id": vectorlake_id,
        "datalake_id": datalake_id
    }
    state_file = os.path.join(os.path.dirname(__file__), 'initialization_state.json')  
    try:
        with open(state_file, 'w') as file:
            json.dump(state, file)
        print(f"State saved to {state_file}.")
    except Exception as e:
        print(f"Error saving state: {e}")

    return vectorlake, vectorlake_id, datalake_id
conversation_history = []

def send_query_to_model(search_query, paramss, vectorlake_instance=None):
    if vectorlake_instance is None:
        vectorlake_instance = VectorLake()  # Create new instance if none provided
        
    try:
        # Step 1: Generate vector for the search query
        vector_search_data = vectorlake_instance.generate(search_query)
        search_vector = vector_search_data.get("vector")

        if not search_vector:
            raise ValueError("Search vector generation failed.")

        # Step 2: Prepare the vector search request with metadata
        vectorlake_search_request = {
            "vector": search_vector,
            "vector_type": "text",
            "vector_document": search_query,
            "metadata": {
                "key": "value"
            }
        }

        # Perform vector search in VectorLake
        search_response = vectorlake_instance.search(vectorlake_search_request)

        # Extract search results from the response
        search_results = search_response.get("results", [])
        if not search_results:
            raise ValueError("No relevant search results found.")

        # Rest of your existing code...
        enriched_context = []
        token_count = 0

        for result in search_results:
            doc_content = result.get("vector_document", "")
            doc_tokens = len(doc_content.split())

            if token_count + doc_tokens <= 1000:
                enriched_context.append(doc_content)
                token_count += doc_tokens
            else:
                break

        enriched_context = " ".join(enriched_context)

        conversation_history.append({
            "role": "user",
            "content": search_query,
            "context_type": "user_conversation"
        })

        payload = {
            "messages": [
                {"role": "system", "content": "You are a helpful assistant."},
                {
                    "role": "user",
                    "content": f"Using the following context from retrieved documents: {enriched_context}, "
                             f"and the conversation history: {conversation_history}, "
                             f"{paramss}"
                             f"if there are multiple copies of same data just ignore it dont mention it dont meantion sure il provide it without meantioning too"
                }
            ],
            "token_size": 3000
        }

        chat_response = ModelLake().chat_complete(payload)
        answer = chat_response.get("answer", "No answer received from ModelLake.")

        print("Chat Answer:", answer)

        conversation_history.append({
            "role": "assistant",
            "content": answer,
            "context_type": "assistant_conversation"
        })

        return answer

    except Exception as e:
        print("Error during processing:", str(e))
        return None

# Usage example:
if __name__ == "__main__":
    link_file_path = os.path.join(os.path.dirname(__file__), 'link.txt')   
    with open(link_file_path, 'r') as file:
        link = file.read().strip()
    print(link)
    vectorlake_instance, vectorlake_id, datalake_id = initialize(link)
    
    if vectorlake_instance:
        result = send_query_to_model(user_query, "", vectorlake_instance)
        print(result)