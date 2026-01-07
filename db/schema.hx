// ============================================
// HYPER-MEMORY SCHEMA - ONTOLOGY V1
// ============================================

// ============================================
// NODES
// ============================================

// MEM - Core memory unit (curated, queryable)
N::Mem {
    INDEX mem_type: String,
    mem_state: String,
    confidence: String,
    statement: String,
    INDEX status: String,
    title: String,
    tags: String,
    notes: String,
    valid_from: String,
    valid_to: String,
    last_validated_at: String,
    created_at: String,
    actors: String
}

// AGENT - AI agent instances
N::Agent {
    INDEX name: String,
    model: String,
    function: String
}

// OBJECT - Things memories are about
N::Object {
    INDEX object_type: String,
    INDEX name: String,
    reference: String,
    description: String
}

// CONTEXT - Where memories apply
N::Context {
    INDEX context_type: String,
    INDEX name: String,
    description: String
}

// TRACE - Internal records (sessions, events, snapshots)
N::Trace {
    INDEX trace_type: String,
    timestamp: String,
    summary: String,
    payload: String
}

// REFERENCE - External sources (urls, docs, commits, etc.)
N::Reference {
    INDEX ref_type: String,
    title: String,
    uri: String,
    retrieved_at: String,
    snippet: String,
    full_text: String
}

// ============================================
// EDGES
// ============================================

// Mem relationships to entities
E::About { From: Mem, To: Object, Properties: {} }
E::InContext { From: Mem, To: Context, Properties: {} }
E::ProposedByAgent { From: Mem, To: Agent, Properties: {} }
E::VersionOf { From: Mem, To: Object, Properties: {} }

// Mem evidence links
E::HasEvidence { From: Mem, To: Trace, Properties: {} }
E::HasEvidenceRef { From: Mem, To: Reference, Properties: {} }

// Mem-to-Mem relationships
E::Supersedes { From: Mem, To: Mem, Properties: { reason: String } }
E::Contradicts { From: Mem, To: Mem, Properties: {} }
E::DependsOn { From: Mem, To: Mem, Properties: {} }
E::HasCause { From: Mem, To: Mem, Properties: {} }
E::HasEffect { From: Mem, To: Mem, Properties: {} }
E::Related { From: Mem, To: Mem, Properties: {} }

// ============================================
// VECTOR STORES
// ============================================

// Embed: statement + notes
V::MemEmbedding {
    memId: String,
    status: String,
    createdAt: String
}

// Embed: title + snippet + full_text (chunked)
V::ReferenceEmbedding {
    refId: String,
    chunkIndex: I64,
    chunkText: String
}

// Embed: summary + payload (chunked)
V::TraceEmbedding {
    traceId: String,
    chunkIndex: I64,
    chunkText: String
}
