/**
 * Generates SQL statements from data.
 * @param {Array<Object>} data - Array of row objects.
 * @param {Array<string>} headers - Array of column names.
 * @param {Object} options - SQL generation options.
 * @param {string} options.dialect - 'mysql', 'postgresql', 'sqlite', 'sqlserver'.
 * @param {string} options.tableName - Name of the table.
 * @param {string} options.primaryKey - Name of the primary key column (optional).
 * @param {boolean} options.dropTable - Whether to include DROP TABLE statement.
 * @returns {string} Generated SQL.
 */
export const generateSql = (data, headers, options) => {
  if (!data || data.length === 0 || !headers || headers.length === 0) {
    return '-- No data to generate SQL from.';
  }

  const { dialect, tableName, primaryKey, dropTable } = options;
  const safeTableName = quoteIdentifier(tableName || 'my_table', dialect);
  
  let sql = '';

  // 1. Generate DROP TABLE
  if (dropTable) {
    sql += `DROP TABLE IF EXISTS ${safeTableName};\n\n`;
  }

  // 2. Analyze Types
  const columnTypes = analyzeColumnTypes(data, headers);

  // 3. Generate CREATE TABLE
  sql += `CREATE TABLE ${safeTableName} (\n`;
  const columnDefs = headers.map(header => {
    const type = getSqlType(columnTypes[header], dialect);
    const safeColName = quoteIdentifier(header, dialect);
    let def = `  ${safeColName} ${type}`;
    if (primaryKey === header) {
      def += ' PRIMARY KEY';
    }
    return def;
  });
  sql += columnDefs.join(',\n');
  sql += '\n);\n\n';

  if (options.onlyStructure) {
    return sql;
  }

  // 4. Generate INSERT Statements
  // Group inserts for supported dialects (MySQL, PostgreSQL, SQL Server 2008+)
  const batchSize = 100; // Batch size for readability and performance
  
  if (dialect === 'mysql' || dialect === 'postgresql' || dialect === 'sqlserver') {
    for (let i = 0; i < data.length; i += batchSize) {
      const batch = data.slice(i, i + batchSize);
      sql += `INSERT INTO ${safeTableName} (${headers.map(h => quoteIdentifier(h, dialect)).join(', ')}) VALUES\n`;
      const values = batch.map(row => {
        return `  (${headers.map(h => formatValue(row[h], columnTypes[h], dialect)).join(', ')})`;
      });
      sql += values.join(',\n');
      sql += ';\n';
    }
  } else {
    // SQLite usually prefers single inserts or UNION SELECT for older versions, 
    // but modern SQLite supports multi-value insert. Let's stick to single for maximum compatibility or multi if safe.
    // Let's use multi-value for SQLite too as it's supported in modern versions.
    for (let i = 0; i < data.length; i += batchSize) {
        const batch = data.slice(i, i + batchSize);
        sql += `INSERT INTO ${safeTableName} (${headers.map(h => quoteIdentifier(h, dialect)).join(', ')}) VALUES\n`;
        const values = batch.map(row => {
          return `  (${headers.map(h => formatValue(row[h], columnTypes[h], dialect)).join(', ')})`;
        });
        sql += values.join(',\n');
        sql += ';\n';
      }
  }

  return sql;
};

const quoteIdentifier = (name, dialect) => {
  if (dialect === 'mysql') return `\`${name}\``;
  if (dialect === 'sqlserver') return `[${name}]`;
  return `"${name}"`; // postgresql, sqlite
};

const formatValue = (value, type, dialect) => {
  if (value === null || value === undefined || value === '') return 'NULL';
  
  if (type === 'number') {
    return value;
  }
  
  // Escape single quotes
  const escaped = String(value).replace(/'/g, "''");
  return `'${escaped}'`;
};

const analyzeColumnTypes = (data, headers) => {
  const types = {};
  
  headers.forEach(header => {
    let isNumber = true;
    let isDate = true;
    let hasData = false;

    for (const row of data) {
      const val = row[header];
      if (val === null || val === undefined || val === '') continue;
      hasData = true;

      // Check number
      if (isNaN(Number(val))) isNumber = false;

      // Check date (simple check)
      if (isNaN(Date.parse(val))) isDate = false;
    }

    if (!hasData) {
      types[header] = 'string'; // Default to string if empty
    } else if (isNumber) {
      types[header] = 'number';
    } else if (isDate) {
      types[header] = 'date';
    } else {
      types[header] = 'string';
    }
  });

  return types;
};

const getSqlType = (jsType, dialect) => {
  switch (jsType) {
    case 'number':
      if (dialect === 'postgresql') return 'NUMERIC';
      if (dialect === 'sqlserver') return 'FLOAT';
      if (dialect === 'sqlite') return 'REAL';
      return 'DOUBLE'; // mysql
    case 'date':
      if (dialect === 'postgresql') return 'TIMESTAMP';
      if (dialect === 'sqlserver') return 'DATETIME';
      if (dialect === 'sqlite') return 'TEXT';
      return 'DATETIME'; // mysql
    default:
      if (dialect === 'postgresql') return 'TEXT';
      if (dialect === 'sqlserver') return 'NVARCHAR(512)';
      if (dialect === 'sqlite') return 'TEXT';
      return 'TEXT'; // mysql
  }
};
