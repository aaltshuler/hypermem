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
    reality_check: Boolean
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
        reality_check: reality_check
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

QUERY updateMemStatus(id: ID, status: String) =>
    mem <- N<Mem>(id)::UPDATE({ status: status })
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
// EDGE OPERATIONS - Mem to Entity (Idempotent)
// ============================================

QUERY linkAbout(memId: ID, objectId: ID, timestamp: Date) =>
    mem <- N<Mem>(memId)
    obj <- N<Object>(objectId)
    existing <- E<About>
    edge <- existing::UpsertE({timestamp: timestamp})::From(mem)::To(obj)
    RETURN edge

QUERY linkAboutRef(memId: ID, refId: ID, timestamp: Date) =>
    mem <- N<Mem>(memId)
    refNode <- N<Reference>(refId)
    existing <- E<AboutRef>
    edge <- existing::UpsertE({timestamp: timestamp})::From(mem)::To(refNode)
    RETURN edge

QUERY linkInContext(memId: ID, contextId: ID, timestamp: Date) =>
    mem <- N<Mem>(memId)
    ctx <- N<Context>(contextId)
    existing <- E<InContext>
    edge <- existing::UpsertE({timestamp: timestamp})::From(mem)::To(ctx)
    RETURN edge

QUERY linkProposedByAgent(memId: ID, agentId: ID, timestamp: Date) =>
    mem <- N<Mem>(memId)
    agent <- N<Agent>(agentId)
    existing <- E<ProposedByAgent>
    edge <- existing::UpsertE({timestamp: timestamp})::From(mem)::To(agent)
    RETURN edge

QUERY linkVersionOf(memId: ID, objectId: ID, timestamp: Date) =>
    mem <- N<Mem>(memId)
    obj <- N<Object>(objectId)
    existing <- E<VersionOf>
    edge <- existing::UpsertE({timestamp: timestamp})::From(mem)::To(obj)
    RETURN edge

// ============================================
// EDGE OPERATIONS - Object to Context (Idempotent)
// ============================================

QUERY linkPartOf(objectId: ID, contextId: ID, timestamp: Date) =>
    obj <- N<Object>(objectId)
    ctx <- N<Context>(contextId)
    existing <- E<PartOf>
    edge <- existing::UpsertE({timestamp: timestamp})::From(obj)::To(ctx)
    RETURN edge

QUERY getObjectDomains(objectId: ID) =>
    obj <- N<Object>(objectId)
    domains <- obj::Out<PartOf>
    RETURN domains

QUERY getDomainObjects(contextId: ID) =>
    ctx <- N<Context>(contextId)
    objs <- ctx::In<PartOf>
    RETURN objs

// ============================================
// EDGE OPERATIONS - Mem to Evidence (Idempotent)
// ============================================

QUERY linkHasEvidence(memId: ID, traceId: ID, timestamp: Date) =>
    mem <- N<Mem>(memId)
    trace <- N<Trace>(traceId)
    existing <- E<HasEvidence>
    edge <- existing::UpsertE({timestamp: timestamp})::From(mem)::To(trace)
    RETURN edge

QUERY linkHasEvidenceRef(memId: ID, refId: ID, timestamp: Date) =>
    mem <- N<Mem>(memId)
    refNode <- N<Reference>(refId)
    existing <- E<HasEvidenceRef>
    edge <- existing::UpsertE({timestamp: timestamp})::From(mem)::To(refNode)
    RETURN edge

// ============================================
// EDGE OPERATIONS - Mem to Mem (Idempotent)
// ============================================

QUERY linkSupersedes(newMemId: ID, oldMemId: ID, reason: String, timestamp: Date) =>
    newMem <- N<Mem>(newMemId)
    oldMem <- N<Mem>(oldMemId)
    existing <- E<Supersedes>
    edge <- existing::UpsertE({reason: reason, timestamp: timestamp})::From(newMem)::To(oldMem)
    RETURN edge

QUERY linkContradicts(memId1: ID, memId2: ID, timestamp: Date) =>
    mem1 <- N<Mem>(memId1)
    mem2 <- N<Mem>(memId2)
    existing <- E<Contradicts>
    edge <- existing::UpsertE({timestamp: timestamp})::From(mem1)::To(mem2)
    RETURN edge

QUERY linkDependsOn(memId: ID, dependsOnMemId: ID, timestamp: Date) =>
    mem <- N<Mem>(memId)
    depMem <- N<Mem>(dependsOnMemId)
    existing <- E<DependsOn>
    edge <- existing::UpsertE({timestamp: timestamp})::From(mem)::To(depMem)
    RETURN edge

QUERY linkCausal(causeMemId: ID, effectMemId: ID, description: String, timestamp: Date) =>
    causeMem <- N<Mem>(causeMemId)
    effectMem <- N<Mem>(effectMemId)
    existing <- E<Causal>
    edge <- existing::UpsertE({description: description, timestamp: timestamp})::From(causeMem)::To(effectMem)
    RETURN edge

QUERY linkRelated(memId1: ID, memId2: ID, timestamp: Date) =>
    mem1 <- N<Mem>(memId1)
    mem2 <- N<Mem>(memId2)
    existing <- E<Related>
    edge <- existing::UpsertE({timestamp: timestamp})::From(mem1)::To(mem2)
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
