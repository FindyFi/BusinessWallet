import type { AgentContext } from '@credo-ts/core';
import {
  BaseRecord,
  JsonTransformer,
  RecordDuplicateError,
  RecordNotFoundError,
} from '@credo-ts/core';

/** @internal Type alias for BaseRecord constructor with required static properties. */
interface RecordConstructor<T extends BaseRecord> {
  new (...args: unknown[]): T;
  type: string;
  allowCache: boolean;
}

/**
 * Simple in-memory storage service compatible with the Credo {@link StorageService} interface.
 *
 * Stores records as plain JSON objects organised by:
 *   contextCorrelationId → record type → record id
 *
 * Suitable for development, testing, and the initial architectural phase.
 * Replace with Askar or a Drizzle-backed database for production deployments.
 */
export class InMemoryStorageService {
  /** contextId → type → id → serialised JSON */
  private readonly store = new Map<string, Map<string, Map<string, string>>>();

  private getTypeStore<T extends BaseRecord>(
    agentContext: AgentContext,
    recordClass: RecordConstructor<T>,
  ): Map<string, string> {
    const contextId = agentContext.contextCorrelationId;
    if (!this.store.has(contextId)) {
      this.store.set(contextId, new Map());
    }
    const contextStore = this.store.get(contextId)!;
    const type = recordClass.type;
    if (!contextStore.has(type)) {
      contextStore.set(type, new Map());
    }
    return contextStore.get(type)!;
  }

  async save<T extends BaseRecord>(agentContext: AgentContext, record: T): Promise<void> {
    const typeStore = this.getTypeStore(agentContext, record.constructor as RecordConstructor<T>);
    if (typeStore.has(record.id)) {
      throw new RecordDuplicateError(`Record with id ${record.id} already exists`, {
        recordType: record.type,
      });
    }
    typeStore.set(record.id, JSON.stringify(record.toJSON()));
  }

  async update<T extends BaseRecord>(agentContext: AgentContext, record: T): Promise<void> {
    const typeStore = this.getTypeStore(agentContext, record.constructor as RecordConstructor<T>);
    if (!typeStore.has(record.id)) {
      throw new RecordNotFoundError(`Record with id ${record.id} not found`, {
        recordType: record.type,
      });
    }
    typeStore.set(record.id, JSON.stringify(record.toJSON()));
  }

  async delete<T extends BaseRecord>(agentContext: AgentContext, record: T): Promise<void> {
    const typeStore = this.getTypeStore(agentContext, record.constructor as RecordConstructor<T>);
    if (!typeStore.has(record.id)) {
      throw new RecordNotFoundError(`Record with id ${record.id} not found`, {
        recordType: record.type,
      });
    }
    typeStore.delete(record.id);
  }

  async deleteById<T extends BaseRecord>(
    agentContext: AgentContext,
    recordClass: RecordConstructor<T>,
    id: string,
  ): Promise<void> {
    const typeStore = this.getTypeStore(agentContext, recordClass);
    if (!typeStore.has(id)) {
      throw new RecordNotFoundError(`Record with id ${id} not found`, {
        recordType: recordClass.type,
      });
    }
    typeStore.delete(id);
  }

  async getById<T extends BaseRecord>(
    agentContext: AgentContext,
    recordClass: RecordConstructor<T>,
    id: string,
  ): Promise<T> {
    const typeStore = this.getTypeStore(agentContext, recordClass);
    const serialised = typeStore.get(id);
    if (!serialised) {
      throw new RecordNotFoundError(`Record with id ${id} not found`, {
        recordType: recordClass.type,
      });
    }
    return JsonTransformer.fromJSON(JSON.parse(serialised), recordClass, { validate: false });
  }

  async getAll<T extends BaseRecord>(
    agentContext: AgentContext,
    recordClass: RecordConstructor<T>,
  ): Promise<T[]> {
    const typeStore = this.getTypeStore(agentContext, recordClass);
    return Array.from(typeStore.values()).map((s) =>
      JsonTransformer.fromJSON(JSON.parse(s), recordClass, { validate: false }),
    );
  }

  async findByQuery<T extends BaseRecord>(
    agentContext: AgentContext,
    recordClass: RecordConstructor<T>,
    query: Record<string, unknown>,
  ): Promise<T[]> {
    const all = await this.getAll(agentContext, recordClass);
    return all.filter((record) => this.matchesQuery(record.getTags() as Record<string, unknown>, query));
  }

  /**
   * Recursively evaluates a Credo tag query against a tags object.
   *
   * Supports the following operators:
   *   - `$or`  – passes if ANY sub-query matches
   *   - `$and` – passes if ALL sub-queries match
   *   - `$not` – passes if the sub-query does NOT match
   *
   * Simple (non-operator) entries are matched as follows:
   *   - `undefined` values are ignored (treated as "any")
   *   - Array tag values are matched if the tag array includes the query value
   *   - Scalar tag values are compared with strict equality
   */
  private matchesQuery(tags: Record<string, unknown>, query: Record<string, unknown>): boolean {
    for (const [key, value] of Object.entries(query)) {
      if (value === undefined) continue;

      if (key === '$or') {
        const subQueries = value as Array<Record<string, unknown>>;
        if (!subQueries.some((sq) => this.matchesQuery(tags, sq))) return false;
        continue;
      }

      if (key === '$and') {
        const subQueries = value as Array<Record<string, unknown>>;
        if (!subQueries.every((sq) => this.matchesQuery(tags, sq))) return false;
        continue;
      }

      if (key === '$not') {
        if (this.matchesQuery(tags, value as Record<string, unknown>)) return false;
        continue;
      }

      const tagValue = tags[key];

      // Array tag (e.g. alternativeDids, recipientKeyFingerprints):
      //   query value is an array → check if every queried element is present in the tag array
      if (Array.isArray(value)) {
        if (!Array.isArray(tagValue)) return false;
        if (!value.every((v) => (tagValue as unknown[]).includes(v))) return false;
        continue;
      }

      // Scalar match
      if (tagValue !== value) return false;
    }
    return true;
  }
}
