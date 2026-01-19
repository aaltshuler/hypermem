// ============================================
// HYPER-MEMORY QUERIES - ONTOLOGY V1
// ============================================

// ============================================
// MEM CRUD
// ============================================

QUERY addMem(
    mem_type: String,
    mem_state: String,
    confidence: String,
    statement: String,
    status: String,
    title: String,
    tags: String,
    notes: String,
    valid_from: Date,
    valid_to: Date,
    created_at: Date,
    actors: String
) =>
    mem <- AddN<Mem>({
        mem_type: mem_type,
        mem_state: mem_state,
        confidence: confidence,
        statement: statement,
        status: status,
        title: title,
        tags: tags,
        notes: notes,
        valid_from: valid_from,
        valid_to: valid_to,
        last_validated_at: created_at,
        created_at: created_at,
        actors: actors
    })
    RETURN mem

QUERY getMem(id: ID) =>
    mem <- N<Mem>(id)
    RETURN mem

QUERY getAllMems() =>
    mems <- N<Mem>
    RETURN mems

QUERY getMemsByType(mem_type: String) =>
    mems <- N<Mem>({mem_type: mem_type})
    RETURN mems

QUERY getMemsByStatus(status: String) =>
    mems <- N<Mem>({status: status})
    RETURN mems

QUERY deleteMem(id: ID) =>
    DROP N<Mem>(id)
    RETURN "deleted"

QUERY updateMemLastValidated(id: ID, last_validated_at: Date) =>
    mem <- N<Mem>(id)::UPDATE({ last_validated_at: last_validated_at })
    RETURN mem

QUERY getContextByName(name: String) =>
    ctx <- N<Context>({name: name})
    RETURN ctx

QUERY deleteContext(id: ID) =>
    DROP N<Context>(id)
    RETURN "deleted"

QUERY deleteObject(id: ID) =>
    DROP N<Object>(id)
    RETURN "deleted"

QUERY deleteTrace(id: ID) =>
    DROP N<Trace>(id)
    RETURN "deleted"

QUERY deleteReference(id: ID) =>
    DROP N<Reference>(id)
    RETURN "deleted"

// ============================================
// OBJECT CRUD
// ============================================

QUERY addObject(
    object_type: String,
    name: String,
    reference: String,
    description: String
) =>
    obj <- AddN<Object>({
        object_type: object_type,
        name: name,
        reference: reference,
        description: description
    })
    RETURN obj

QUERY getObject(id: ID) =>
    obj <- N<Object>(id)
    RETURN obj

QUERY getObjectByName(name: String) =>
    obj <- N<Object>({name: name})
    RETURN obj

QUERY getAllObjects() =>
    objs <- N<Object>
    RETURN objs

QUERY getObjectsByType(object_type: String) =>
    objs <- N<Object>({object_type: object_type})
    RETURN objs

// ============================================
// CONTEXT CRUD
// ============================================

QUERY addContext(
    context_type: String,
    name: String,
    description: String
) =>
    ctx <- AddN<Context>({
        context_type: context_type,
        name: name,
        description: description
    })
    RETURN ctx

QUERY getContext(id: ID) =>
    ctx <- N<Context>(id)
    RETURN ctx

QUERY getAllContexts() =>
    ctxs <- N<Context>
    RETURN ctxs

// ============================================
// AGENT CRUD
// ============================================

QUERY addAgent(
    name: String,
    model: String,
    function: String
) =>
    agent <- AddN<Agent>({
        name: name,
        model: model,
        function: function
    })
    RETURN agent

QUERY getAgent(id: ID) =>
    agent <- N<Agent>(id)
    RETURN agent

QUERY getAgentByName(name: String) =>
    agent <- N<Agent>({name: name})
    RETURN agent

QUERY getAllAgents() =>
    agents <- N<Agent>
    RETURN agents

// ============================================
// TRACE CRUD
// ============================================

QUERY addTrace(
    trace_type: String,
    timestamp: Date,
    summary: String,
    payload: String
) =>
    trace <- AddN<Trace>({
        trace_type: trace_type,
        timestamp: timestamp,
        summary: summary,
        payload: payload
    })
    RETURN trace

QUERY getTrace(id: ID) =>
    trace <- N<Trace>(id)
    RETURN trace

QUERY getAllTraces() =>
    traces <- N<Trace>
    RETURN traces

QUERY getTracesByType(trace_type: String) =>
    traces <- N<Trace>({trace_type: trace_type})
    RETURN traces

// ============================================
// REFERENCE CRUD
// ============================================

QUERY addReference(
    ref_type: String,
    title: String,
    uri: String,
    retrieved_at: Date,
    snippet: String,
    full_text: String
) =>
    reference <- AddN<Reference>({
        ref_type: ref_type,
        title: title,
        uri: uri,
        retrieved_at: retrieved_at,
        snippet: snippet,
        full_text: full_text
    })
    RETURN reference

QUERY getReference(id: ID) =>
    reference <- N<Reference>(id)
    RETURN reference

QUERY getAllReferences() =>
    references <- N<Reference>
    RETURN references

QUERY getReferencesByType(ref_type: String) =>
    references <- N<Reference>({ref_type: ref_type})
    RETURN references

// ============================================
// EDGE OPERATIONS - Mem to Entity
// ============================================

QUERY linkAbout(memId: ID, objectId: ID) =>
    edge <- AddE<About>::From(memId)::To(objectId)
    RETURN edge

QUERY linkInContext(memId: ID, contextId: ID) =>
    edge <- AddE<InContext>::From(memId)::To(contextId)
    RETURN edge

QUERY linkProposedByAgent(memId: ID, agentId: ID) =>
    edge <- AddE<ProposedByAgent>::From(memId)::To(agentId)
    RETURN edge

QUERY linkVersionOf(memId: ID, objectId: ID) =>
    edge <- AddE<VersionOf>::From(memId)::To(objectId)
    RETURN edge

// ============================================
// EDGE OPERATIONS - Mem to Evidence
// ============================================

QUERY linkHasEvidence(memId: ID, traceId: ID) =>
    edge <- AddE<HasEvidence>::From(memId)::To(traceId)
    RETURN edge

QUERY linkHasEvidenceRef(memId: ID, refId: ID) =>
    edge <- AddE<HasEvidenceRef>::From(memId)::To(refId)
    RETURN edge

// ============================================
// EDGE OPERATIONS - Mem to Mem
// ============================================

QUERY linkSupersedes(newMemId: ID, oldMemId: ID, reason: String) =>
    edge <- AddE<Supersedes>({reason: reason})::From(newMemId)::To(oldMemId)
    RETURN edge

QUERY linkContradicts(memId1: ID, memId2: ID) =>
    edge <- AddE<Contradicts>::From(memId1)::To(memId2)
    RETURN edge

QUERY linkDependsOn(memId: ID, dependsOnMemId: ID) =>
    edge <- AddE<DependsOn>::From(memId)::To(dependsOnMemId)
    RETURN edge

QUERY linkHasCause(effectMemId: ID, causeMemId: ID) =>
    edge <- AddE<HasCause>::From(effectMemId)::To(causeMemId)
    RETURN edge

QUERY linkHasEffect(causeMemId: ID, effectMemId: ID) =>
    edge <- AddE<HasEffect>::From(causeMemId)::To(effectMemId)
    RETURN edge

QUERY linkRelated(memId1: ID, memId2: ID) =>
    edge <- AddE<Related>::From(memId1)::To(memId2)
    RETURN edge

// ============================================
// VECTOR OPERATIONS - Mem
// ============================================

QUERY addMemEmbedding(memId: String, status: String, createdAt: Date, embedding: [F64]) =>
    vec <- AddV<MemEmbedding>(embedding, {
        memId: memId,
        status: status,
        createdAt: createdAt
    })
    RETURN vec

QUERY searchMems(embedding: [F64], limit: I64) =>
    results <- SearchV<MemEmbedding>(embedding, limit)
    RETURN results

// ============================================
// VECTOR OPERATIONS - Reference (chunked)
// ============================================

QUERY addReferenceEmbedding(refId: String, chunkIndex: I64, chunkText: String, embedding: [F64]) =>
    vec <- AddV<ReferenceEmbedding>(embedding, {
        refId: refId,
        chunkIndex: chunkIndex,
        chunkText: chunkText
    })
    RETURN vec

QUERY searchReferences(embedding: [F64], limit: I64) =>
    results <- SearchV<ReferenceEmbedding>(embedding, limit)
    RETURN results

// ============================================
// VECTOR OPERATIONS - Trace (chunked)
// ============================================

QUERY addTraceEmbedding(traceId: String, chunkIndex: I64, chunkText: String, embedding: [F64]) =>
    vec <- AddV<TraceEmbedding>(embedding, {
        traceId: traceId,
        chunkIndex: chunkIndex,
        chunkText: chunkText
    })
    RETURN vec

QUERY searchTraces(embedding: [F64], limit: I64) =>
    results <- SearchV<TraceEmbedding>(embedding, limit)
    RETURN results

// ============================================
// GRAPH TRAVERSALS
// ============================================

QUERY getMemObjects(memId: ID) =>
    mem <- N<Mem>(memId)
    objs <- mem::Out<About>
    RETURN objs

QUERY getMemContexts(memId: ID) =>
    mem <- N<Mem>(memId)
    ctxs <- mem::Out<InContext>
    RETURN ctxs

QUERY getMemAgents(memId: ID) =>
    mem <- N<Mem>(memId)
    agents <- mem::Out<ProposedByAgent>
    RETURN agents

QUERY getMemEvidence(memId: ID) =>
    mem <- N<Mem>(memId)
    traces <- mem::Out<HasEvidence>
    RETURN traces

QUERY getMemEvidenceRefs(memId: ID) =>
    mem <- N<Mem>(memId)
    evidenceRefs <- mem::Out<HasEvidenceRef>
    RETURN evidenceRefs

QUERY getSupersededBy(memId: ID) =>
    mem <- N<Mem>(memId)
    superseding <- mem::In<Supersedes>
    RETURN superseding

QUERY getSupersedes(memId: ID) =>
    mem <- N<Mem>(memId)
    superseded <- mem::Out<Supersedes>
    RETURN superseded

QUERY getContradictions(memId: ID) =>
    mem <- N<Mem>(memId)
    contradicting <- mem::Out<Contradicts>
    RETURN contradicting

QUERY getDependencies(memId: ID) =>
    mem <- N<Mem>(memId)
    deps <- mem::Out<DependsOn>
    RETURN deps

QUERY getDependents(memId: ID) =>
    mem <- N<Mem>(memId)
    dependents <- mem::In<DependsOn>
    RETURN dependents

QUERY getRelatedMems(memId: ID) =>
    mem <- N<Mem>(memId)
    related <- mem::Out<Related>
    RETURN related

QUERY getObjectVersions(objectId: ID) =>
    obj <- N<Object>(objectId)
    versions <- obj::In<VersionOf>
    RETURN versions
