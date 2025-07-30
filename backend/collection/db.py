import chromadb
from chromadb.utils import embedding_functions
from core.config import settings
from collection.corpus import CORPUS


def boot_up_collection():
    client = chromadb.PersistentClient(path="./chroma")

    ef = embedding_functions.OpenAIEmbeddingFunction(
        api_key=settings.openai_api_key,
        model_name=settings.embed_model,
    )

    collection = client.get_or_create_collection(
        name="travis_resume",
        embedding_function=ef,
        metadata={"hnsw:space": "cosine"},
    )

    ids        = [f"doc_{i}" for i, _ in enumerate(CORPUS, start=1)]
    documents  = [entry["document"]  for entry in CORPUS]
    metadatas  = [entry["metadata"]  for entry in CORPUS]

    collection.add(
    ids=ids,
    documents=documents,
    metadatas=metadatas,
)

    return collection
