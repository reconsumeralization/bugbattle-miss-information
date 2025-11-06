# Onboarding: Large Text Processing Pipeline

This guide explains the conceptual "Large Text Processing & Vectorization Implementation Plan" that is simulated within the Vulnerability Testing Framework (VTF). We'll break down each phase of the plan, its purpose, and the "calculations" or logic involved at a high level, referencing the Python script simulation in `constants/poc.constants.ts` and the `TextProcessingPlanPage.tsx`.

## 1. Goal of the Plan

The primary goal of this plan is to outline a robust and memory-efficient strategy for processing very large text files (e.g., 175MB+ as mentioned in the original context that inspired this plan). The processed text is intended to be transformed into a queryable, semantically indexed format, suitable for tasks like:

*   Generating high-quality training data for AI models.
*   Creating an intelligent Q&A system over the large text corpus.
*   Performing semantic searches and analysis.

The VTF simulates this plan conceptually; a real implementation would involve significant NLP libraries and computational resources. **Crucially, if the large text files themselves contain sensitive information, the security principles discussed elsewhere (like preventing unauthorized access or exfiltration as seen with `window.WIZ_global_data` and `gtm-loader.js`) would apply to protect the data throughout this pipeline and its outputs.**

## 2. Overview of the Simulated Python Script

The Python script detailed in `constants/text_processing.constants.ts` (and included as a PoC script in `constants/poc.constants.ts` under "Large Text Processing Plan Script") provides a simulated code structure for each phase. The `TextProcessingPlanPage.tsx` displays this plan and its associated checklist.

## 3. Phase-by-Phase Breakdown

Let's walk through each phase of the plan as simulated:

### Phase 1: Safe File Analysis & Chunking Strategy

*   **Purpose:** To understand the input file and process it without loading the entire content into memory at once, which is crucial for large files.
*   **Components (Simulated):**
    *   **`analyze_file_safely_sim(file_path: str)`:**
        *   **Step 1:** Get file size (e.g., using `os.path.getsize`).
        *   **Step 2:** Read a small sample (e.g., first 1000 lines) to understand basic structure, encoding, and content type.
        *   **"Calculation":** This phase is more about inspection than complex calculation. The key is *not* reading the whole file.
    *   **`stream_chunk_file_sim(file_path: str, chunk_size: int)`:**
        *   **Step 1:** Open the file for reading.
        *   **Step 2 (Iterative "Calculation"):**
            *   Read lines one by one, adding them to a temporary `chunk` list.
            *   When the `chunk` list reaches `chunk_size` (e.g., 1000 lines), `yield` (return) this chunk for processing.
            *   Clear the `chunk` list and continue.
            *   After the whole file is read, `yield` any remaining lines in the last chunk.
        *   **Benefit:** This generator pattern processes the file piece by piece, keeping memory usage low.

### Phase 2: Text Preprocessing & Concept Extraction

*   **Purpose:** To clean the text chunks and identify important concepts or keywords within them.
*   **Components (Simulated):**
    *   **`TextSegmenterSim: segment_by_context(text_chunk: list[str])`:**
        *   **Step 1:** Takes a chunk of lines.
        *   **Step 2 (Conceptual "Calculation"):** Aims to split the text into meaningful segments (larger than sentences, smaller than full chunks) that maintain semantic coherence. The simulation might look for paragraph breaks (`\\n\\n`) or try to keep segments within a target length (e.g., 500 characters).
        *   **Goal:** Avoid breaking ideas mid-thought.
    *   **`ConceptWeightExtractorSim: extract_concepts(segments: list[str])`:**
        *   **Step 1:** Takes a list of text segments.
        *   **Step 2 (Conceptual "Calculation"):** This simulates identifying important terms/concepts and assigning them weights.
            *   A real implementation might use TF-IDF (Term Frequency-Inverse Document Frequency) to find terms that are important within a segment but not overly common across all segments.
            *   It could also involve Named Entity Recognition (NER) or keyword extraction algorithms.
            *   The simulation (`poc.constants.ts`) returns a mock dictionary like `{'mock_concept': {'total_weight': 1.0}}`.
        *   **Output:** A dictionary where keys are concepts and values are their calculated weights or scores.

### Phase 3: Vectorization Strategy

*   **Purpose:** To convert the text segments into numerical representations (vectors or embeddings) that machine learning models can understand. These vectors capture semantic meaning.
*   **Components (Simulated):**
    *   **`EfficientVectorizerSim: vectorize_batch(segments: list[str], batch_size=int)`:**
        *   **Step 1:** Initializes a pre-trained sentence embedding model (e.g., from `sentence-transformers` library – conceptually).
        *   **Step 2 (Iterative "Calculation"):**
            *   Processes `segments` in `batch_size` (e.g., 32 or 64 segments at a time) to manage memory.
            *   For each batch, the model converts text segments into dense numerical vectors (embeddings).
            *   These embeddings are collected.
        *   **Output:** A list of numerical vectors, one for each segment.
    *   **`WeightedSemanticIndexSim: build_weighted_index(segments: list[str], concept_weights: dict)`:**
        *   **Step 1:** Takes the base embeddings and the `concept_weights` from Phase 2.
        *   **Step 2 (Conceptual "Calculation"):**
            *   For each segment's embedding, it identifies which concepts (from `concept_weights`) are present in that segment.
            *   It calculates a `weight_factor` based on the importance/frequency of these concepts in the segment.
            *   It *multiplies* the base embedding by this `weight_factor`. This "boosts" the parts of the embedding related to important concepts.
        *   **Step 3:** The (weighted) embeddings are added to an efficient search index like FAISS (Facebook AI Similarity Search). FAISS allows for very fast searching of similar vectors. (This is conceptual in the simulation).
        *   **Goal:** Create an index where queries can quickly find the most semantically relevant (and important) text segments.

### Phase 4: Queryable Chat Object

*   **Purpose:** To provide an interface for asking questions or making queries against the processed and indexed text.
*   **Components (Simulated):**
    *   **`IntelligentChatQuerySim: process_query(query: str, top_k=int)`:**
        *   **Step 1:** Takes a user's `query` string.
        *   **Step 2 (Conceptual "Calculation"):**
            *   The `query` itself is converted into an embedding using the same model from Phase 3.
            *   **Concept Boosting (Optional):** The query embedding might be "boosted" if the query contains known important concepts.
            *   The (boosted) query embedding is used to search the FAISS index for the `top_k` most similar segment embeddings.
        *   **Step 3 (Reranking - Conceptual):** The initial `top_k` results might be reranked based on additional factors like:
            *   Context from previous turns in the conversation.
            *   Higher weight for segments that strongly feature concepts mentioned in the query.
        *   **Step 4 (Response Generation - Conceptual):** The system combines information from the top-ranked relevant segments to generate a coherent answer or summary.
        *   **Step 5 (Context Update - Conceptual):** The query and parts of the response are added to a context window to inform future interactions.
        *   **Output:** A dictionary containing the original query, the most relevant segments found, a combined context/answer, and confidence scores.

### Phase 5: Implementation Workflow & Pipeline

*   **Purpose:** To tie all the above phases together into a single, executable process.
*   **Component (Simulated):**
    *   **`process_large_text_file_pipeline_sim(file_path: str)` (in `poc.constants.ts` PoC script):**
        *   This function calls the simulated methods from each phase in sequence:
            1.  `analyze_file_safely_sim`
            2.  `stream_chunk_file_sim` (iteratively)
            3.  `TextSegmenterSim().segment_by_context` (for each chunk)
            4.  `ConceptWeightExtractorSim().extract_concepts` (on all segments)
            5.  `EfficientVectorizerSim().vectorize_batch` and `WeightedSemanticIndexSim().build_weighted_index`
            6.  Conceptually initializes `IntelligentChatQuerySim`.
        *   The simulation prints log messages at each step, indicating progress.
        *   It concludes with an `OUTPUT: INFO: Large text processing pipeline simulation complete.`

## 4. Key "Calculations" and Concepts

*   **Chunking:** Dividing a large file into smaller, manageable pieces (calculation: based on `chunk_size`).
*   **Segmentation:** Breaking text into semantically coherent units (calculation: based on rules like paragraph breaks, target length).
*   **Concept Weighting:** Assigning importance scores to terms/concepts (calculation: e.g., TF-IDF, frequency, custom scores).
*   **Vectorization/Embeddings:** Converting text to numerical vectors that capture meaning.
*   **Similarity Search:** Finding vectors (and thus text segments) that are "closest" to a query vector (calculation: e.g., cosine similarity, inner product, handled by FAISS).
*   **Weighted Indexing:** Modifying embeddings based on concept weights to improve search relevance (calculation: e.g., element-wise multiplication of embedding by a weight factor).

## 5. Memory Management & Performance

The plan emphasizes:
*   **Streaming:** Not loading the whole file at once.
*   **Batching:** Processing data in small batches for vectorization.
*   **Efficient Indexing:** Using tools like FAISS for fast search.

## 6. VTF Display

*   **`TextProcessingPlanPage.tsx`:** Displays the overview text (which includes the Python code snippets) and the `LARGE_TEXT_PROCESSING_CHECKLIST_DATA`.
*   **`PocPage.tsx`:** Allows "running" the simulated Python pipeline script, showing the step-by-step log output.

This onboarding guide provides a detailed walkthrough of the conceptual plan for large text processing as simulated in the VTF. It highlights the purpose of each phase and the underlying logic or "calculations" involved at a high level, reminding us that the security of the data within such a pipeline is paramount.