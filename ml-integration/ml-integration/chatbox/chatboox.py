# Initialize conversation history (run this once if it's not initialized yet)
import os
from groclake.cataloglake import CatalogLake
def initialize(link):
# Environment variable setup
  GROCLAKE_API_KEY = '35f4a8d465e6e1edc05f3d8ab658c551'
  GROCLAKE_ACCOUNT_ID = 'b37a323283e59c84e5f47ae739751357'

  os.environ['GROCLAKE_API_KEY'] = GROCLAKE_API_KEY
  os.environ['GROCLAKE_ACCOUNT_ID'] = GROCLAKE_ACCOUNT_ID

  # Initialize Groclake catalog instance
  catalog = CatalogLake()
  from groclake.vectorlake import VectorLake
  from groclake.datalake import DataLake
  from groclake.modellake import ModelLake
  try:
    vectorlake=VectorLake()
    vector_create=vectorlake.create()
    vectorlake_id=vector_create['vectorlake_id']
    print(vectorlake_id)
    datalake=DataLake()
    datalake_create=datalake.create()
    datalake_id=datalake_create['datalake_id']
    print(datalake_id)
  except Exception as e:
    print(e)
  try:
    payload_push={
        "datalake_id":datalake_id,
        "document_type": "url",
          "document_data": link
    }
    data_push=datalake.push(payload_push)
    print(data_push)
    document_id=data_push.get("document_id")
    print(document_id)
  except Exception as e:
    print(e)
  try:
    payload_fetch = {
        "datalake_id": datalake_id,
        "document_id": document_id,
        "fetch_format" : "chunk",
        "chunk_size" : "500"
    }
    data_fetch = datalake.fetch(payload_fetch)
    document_chunks = data_fetch.get("document_data",[])
    print(document_chunks)
  except Exception as e:
    print(e)
  try:
    for idx,chunk in enumerate(document_chunks):
      print(chunk)
      vector_doc=vectorlake.generate(chunk)
      vector_chunk=vector_doc.get("vector")
      print(vector_chunk)
      vectorlake_push_payload={
          "vector" : vector_chunk,
          "vectorlake_id" : vectorlake_id,
          "document_text" : chunk,
          "vector_type" : "text",
          "metadata" : {}
      }
      push_response=vectorlake.push(vectorlake_push_payload)
      print(push_response)
  except Exception as e:
    print(e)
conversation_history = []

# Function to send query to model and handle conversation
def send_query_to_model(search_query,paramss):
    try:
        # Step 1: Generate vector for the search query
        vector_search_data = vectorlake.generate(search_query)
        search_vector = vector_search_data.get("vector")

        if not search_vector:
            raise ValueError("Search vector generation failed.")

        # Step 2: Prepare the vector search request with metadata
        vectorlake_search_request = {
            "vector": search_vector,
            "vector_type": "text",
            "vector_document": search_query,
            "metadata": {
                "key": "value"  # Custom metadata can be added here if needed
            }
        }

        # Perform vector search in VectorLake
        search_response = vectorlake.search(vectorlake_search_request)

        # Extract search results from the response
        search_results = search_response.get("results", [])
        if not search_results:
            raise ValueError("No relevant search results found.")

        # Step 3: Combine relevant vector documents into enriched context
        enriched_context = []
        token_count = 0

        for result in search_results:
            doc_content = result.get("vector_document", "")
            doc_tokens = len(doc_content.split())

            if token_count + doc_tokens <= 1000:  # Adjust token limit dynamically
                enriched_context.append(doc_content)
                token_count += doc_tokens
            else:
                break  # Stop when the token limit is reached

        enriched_context = " ".join(enriched_context)

        # Step 4: Update conversation history with current context
        conversation_history.append({
            "role": "user",
            "content": search_query,
            "context_type": "user_conversation"  # Mark as part of the ongoing conversation
        })

        # Step 5: Construct the ModelLake query with the full conversation context
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
            "token_size": 3000  # Adjust as needed based on ModelLake limits
        }

        # Step 6: Query ModelLake for a response
        chat_response = ModelLake().chat_complete(payload)
        # Extract the assistant's answer
        answer = chat_response.get("answer", "No answer received from ModelLake.")

        # Step 7: Print the answer and update the conversation history
        print("Chat Answer:", answer)

        # Update conversation history with the assistant's new response, keeping the distinction
        conversation_history.append({
            "role": "assistant",
            "content": answer,
            "context_type": "assistant_conversation"  # Mark as part of the ongoing conversation
        })

        return answer  # Return answer so it can be used outside if needed

    except Exception as e:
        print("Error during processing:", str(e))
        return None
