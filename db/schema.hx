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
    valid_from: Date,
    valid_to: Date,
    last_validated_at: Date,
    created_at: Date,
    reality_check: Boolean
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
    timestamp: Date,
    summary: String,
    payload: String
}

// REFERENCE - External sources (urls, docs, commits, etc.)
N::Reference {
    INDEX ref_type: String,
    title: String,
    uri: String,
    retrieved_at: Date,
    snippet: String,
    full_text: String
}

// ============================================
// EDGES
// ============================================

// Mem relationships to entities
E::About { From: Mem, To: Object, Properties: { timestamp: Date DEFAULT NOW } }
E::AboutRef { From: Mem, To: Reference, Properties: { timestamp: Date DEFAULT NOW } }
E::InContext { From: Mem, To: Context, Properties: { timestamp: Date DEFAULT NOW } }
E::ProposedByAgent { From: Mem, To: Agent, Properties: { timestamp: Date DEFAULT NOW } }
E::VersionOf { From: Mem, To: Object, Properties: { timestamp: Date DEFAULT NOW } }

// Object relationships
E::PartOf { From: Object, To: Context, Properties: { timestamp: Date DEFAULT NOW } }

// Mem evidence links
E::HasEvidence { From: Mem, To: Trace, Properties: { timestamp: Date DEFAULT NOW } }
E::HasEvidenceRef { From: Mem, To: Reference, Properties: { timestamp: Date DEFAULT NOW } }

// Mem-to-Mem relationships
E::Supersedes { From: Mem, To: Mem, Properties: { reason: String, timestamp: Date DEFAULT NOW } }
E::Contradicts { From: Mem, To: Mem, Properties: { timestamp: Date DEFAULT NOW } }
E::DependsOn { From: Mem, To: Mem, Properties: { timestamp: Date DEFAULT NOW } }
E::Causal { From: Mem, To: Mem, Properties: { description: String, timestamp: Date DEFAULT NOW } }
E::Related { From: Mem, To: Mem, Properties: { timestamp: Date DEFAULT NOW } }

// ============================================
// VECTOR STORES
// ============================================

// Embed: statement + notes
V::MemEmbedding {
    memId: String,
    status: String,
    createdAt: Date
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
