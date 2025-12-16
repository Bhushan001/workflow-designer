// Utility functions for data viewing (schema, json, table)

export interface SchemaItem {
  key: string;
  type: string;
  path: string;
}

export function generateSchema(data: any, prefix = ''): SchemaItem[] {
  const schema: SchemaItem[] = [];

  if (data === null || data === undefined) {
    return [{ key: prefix || 'root', type: 'null', path: prefix || 'root' }];
  }

  if (Array.isArray(data)) {
    if (data.length > 0) {
      schema.push({ key: prefix || 'root', type: 'array', path: prefix || 'root' });
      // Analyze first item to infer structure
      const itemSchema = generateSchema(data[0], `${prefix ? prefix + '.' : ''}[0]`);
      schema.push(...itemSchema);
    } else {
      schema.push({ key: prefix || 'root', type: 'array (empty)', path: prefix || 'root' });
    }
    return schema;
  }

  if (typeof data === 'object') {
    for (const [key, value] of Object.entries(data)) {
      const path = prefix ? `${prefix}.${key}` : key;
      const type = Array.isArray(value) 
        ? 'array' 
        : value === null 
        ? 'null' 
        : typeof value;

      schema.push({ key, type, path });

      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        const nestedSchema = generateSchema(value, path);
        schema.push(...nestedSchema.slice(1)); // Skip the root entry
      } else if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object') {
        const nestedSchema = generateSchema(value[0], `${path}[0]`);
        schema.push(...nestedSchema.slice(1));
      }
    }
    return schema;
  }

  return [{ key: prefix || 'root', type: typeof data, path: prefix || 'root' }];
}

export function convertToTable(data: any): { columns: string[]; rows: any[][] } {
  if (!data || typeof data !== 'object') {
    return { columns: ['Value'], rows: [[String(data)]] };
  }

  // If it's an array
  if (Array.isArray(data)) {
    if (data.length === 0) {
      return { columns: [], rows: [] };
    }

    // If array of objects, use object keys as columns
    if (typeof data[0] === 'object' && data[0] !== null && !Array.isArray(data[0])) {
      const columns = Object.keys(data[0]);
      const rows = data.map(item => 
        columns.map(col => {
          const value = item[col];
          if (value === null || value === undefined) return '';
          if (typeof value === 'object') return JSON.stringify(value);
          return String(value);
        })
      );
      return { columns, rows };
    }

    // If array of primitives
    return {
      columns: ['Index', 'Value'],
      rows: data.map((item, idx) => [String(idx), String(item)])
    };
  }

  // If it's an object, try to convert to table
  const entries = Object.entries(data);
  if (entries.length === 0) {
    return { columns: [], rows: [] };
  }

  // Check if all values are arrays of same length (table-like structure)
  const firstArrayEntry = entries.find(([_, v]) => Array.isArray(v));
  if (firstArrayEntry) {
    const arrayLength = (firstArrayEntry[1] as any[]).length;
    const allSameLength = entries.every(([_, v]) => 
      !Array.isArray(v) || (v as any[]).length === arrayLength
    );

    if (allSameLength) {
      const columns = entries.map(([k]) => k);
      const rows: any[][] = [];
      for (let i = 0; i < arrayLength; i++) {
        rows.push(entries.map(([_, v]) => {
          const value = Array.isArray(v) ? v[i] : v;
          if (value === null || value === undefined) return '';
          if (typeof value === 'object') return JSON.stringify(value);
          return String(value);
        }));
      }
      return { columns, rows };
    }
  }

  // Default: key-value table
  return {
    columns: ['Key', 'Value'],
    rows: entries.map(([key, value]) => [
      key,
      typeof value === 'object' ? JSON.stringify(value) : String(value)
    ])
  };
}

